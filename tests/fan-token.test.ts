// tests/fan-token.test.ts

import { describe, it, expect, beforeEach } from "vitest"

type ContractState = {
  admin: string
  paused: boolean
  totalSupply: bigint
  balances: Map<string, bigint>
  staked: Map<string, bigint>
  MAX_SUPPLY: bigint
}

type Result<T> = { value: T } | { error: number }

const createMockContract = (): ContractState & {
  isAdmin: (caller: string) => boolean
  setPaused: (caller: string, pause: boolean) => Result<boolean>
  mint: (caller: string, recipient: string, amount: bigint) => Result<boolean>
  transfer: (caller: string, recipient: string, amount: bigint) => Result<boolean>
  burn: (caller: string, amount: bigint) => Result<boolean>
  stake: (caller: string, amount: bigint) => Result<boolean>
  unstake: (caller: string, amount: bigint) => Result<boolean>
} => {
  const contract: ContractState = {
    admin: "ST1ADMIN00000000000000000000000000000000",
    paused: false,
    totalSupply: 0n,
    balances: new Map(),
    staked: new Map(),
    MAX_SUPPLY: 100_000_000n,
  }

  return {
    ...contract,

    isAdmin(caller: string): boolean {
      return caller === this.admin
    },

    setPaused(caller: string, pause: boolean): Result<boolean> {
      if (!this.isAdmin(caller)) return { error: 100 } // ERR-NOT-AUTHORIZED
      this.paused = pause
      return { value: pause }
    },

    mint(caller: string, recipient: string, amount: bigint): Result<boolean> {
      if (!this.isAdmin(caller)) return { error: 100 }
      if (recipient === "SP000000000000000000002Q6VF78") return { error: 105 } // ERR-ZERO-ADDRESS
      const newSupply = this.totalSupply + amount
      if (newSupply > this.MAX_SUPPLY) return { error: 103 } // ERR-MAX-SUPPLY-REACHED
      const current = this.balances.get(recipient) || 0n
      this.balances.set(recipient, current + amount)
      this.totalSupply = newSupply
      return { value: true }
    },

    transfer(caller: string, recipient: string, amount: bigint): Result<boolean> {
      if (this.paused) return { error: 104 } // ERR-PAUSED
      if (recipient === "SP000000000000000000002Q6VF78") return { error: 105 } // ERR-ZERO-ADDRESS
      const senderBal = this.balances.get(caller) || 0n
      if (senderBal < amount) return { error: 101 } // ERR-INSUFFICIENT-BALANCE
      this.balances.set(caller, senderBal - amount)
      const recipientBal = this.balances.get(recipient) || 0n
      this.balances.set(recipient, recipientBal + amount)
      return { value: true }
    },

    burn(caller: string, amount: bigint): Result<boolean> {
      if (this.paused) return { error: 104 }
      const balance = this.balances.get(caller) || 0n
      if (balance < amount) return { error: 101 }
      this.balances.set(caller, balance - amount)
      this.totalSupply -= amount
      return { value: true }
    },

    stake(caller: string, amount: bigint): Result<boolean> {
      if (this.paused) return { error: 104 }
      const balance = this.balances.get(caller) || 0n
      if (balance < amount) return { error: 101 }
      this.balances.set(caller, balance - amount)
      const staked = this.staked.get(caller) || 0n
      this.staked.set(caller, staked + amount)
      return { value: true }
    },

    unstake(caller: string, amount: bigint): Result<boolean> {
      if (this.paused) return { error: 104 }
      const staked = this.staked.get(caller) || 0n
      if (staked < amount) return { error: 102 } // ERR-INSUFFICIENT-STAKE
      this.staked.set(caller, staked - amount)
      const balance = this.balances.get(caller) || 0n
      this.balances.set(caller, balance + amount)
      return { value: true }
    },
  }
}

describe("TrueSide Fan Token Contract (Mock)", () => {
  let mock: ReturnType<typeof createMockContract>
  const userA = "ST2USER00000000000000000000000000000000"
  const userB = "ST3USER00000000000000000000000000000000"

  beforeEach(() => {
    mock = createMockContract()
  })

  it("allows admin to mint tokens", () => {
    const result = mock.mint(mock.admin, userA, 1000n)
    expect(result).toEqual({ value: true })
    expect(mock.balances.get(userA)).toBe(1000n)
  })

  it("prevents non-admin from minting", () => {
    const result = mock.mint(userA, userA, 1000n)
    expect(result).toEqual({ error: 100 })
  })

  it("prevents minting beyond max supply", () => {
    const result = mock.mint(mock.admin, userA, 200_000_000n)
    expect(result).toEqual({ error: 103 })
  })

  it("transfers tokens successfully", () => {
    mock.mint(mock.admin, userA, 500n)
    const result = mock.transfer(userA, userB, 200n)
    expect(result).toEqual({ value: true })
    expect(mock.balances.get(userA)).toBe(300n)
    expect(mock.balances.get(userB)).toBe(200n)
  })

  it("prevents transfers when paused", () => {
    mock.setPaused(mock.admin, true)
    const result = mock.transfer(userA, userB, 10n)
    expect(result).toEqual({ error: 104 })
  })

  it("stakes tokens correctly", () => {
    mock.mint(mock.admin, userA, 1000n)
    const result = mock.stake(userA, 600n)
    expect(result).toEqual({ value: true })
    expect(mock.balances.get(userA)).toBe(400n)
    expect(mock.staked.get(userA)).toBe(600n)
  })

  it("prevents staking more than balance", () => {
    mock.mint(mock.admin, userA, 100n)
    const result = mock.stake(userA, 200n)
    expect(result).toEqual({ error: 101 })
  })

  it("unstakes tokens correctly", () => {
    mock.mint(mock.admin, userA, 1000n)
    mock.stake(userA, 500n)
    const result = mock.unstake(userA, 200n)
    expect(result).toEqual({ value: true })
    expect(mock.staked.get(userA)).toBe(300n)
    expect(mock.balances.get(userA)).toBe(700n)
  })

  it("prevents unstaking more than staked", () => {
    mock.mint(mock.admin, userA, 500n)
    mock.stake(userA, 300n)
    const result = mock.unstake(userA, 400n)
    expect(result).toEqual({ error: 102 })
  })

  it("burns tokens successfully", () => {
    mock.mint(mock.admin, userA, 1000n)
    const result = mock.burn(userA, 400n)
    expect(result).toEqual({ value: true })
    expect(mock.balances.get(userA)).toBe(600n)
    expect(mock.totalSupply).toBe(600n)
  })

  it("prevents burning more than balance", () => {
    mock.mint(mock.admin, userA, 300n)
    const result = mock.burn(userA, 500n)
    expect(result).toEqual({ error: 101 })
  })

  it("prevents minting to zero address", () => {
    const result = mock.mint(mock.admin, "SP000000000000000000002Q6VF78", 1000n)
    expect(result).toEqual({ error: 105 })
  })

  it("allows admin to pause and unpause", () => {
    const pauseResult = mock.setPaused(mock.admin, true)
    expect(pauseResult).toEqual({ value: true })
    expect(mock.paused).toBe(true)

    const unpauseResult = mock.setPaused(mock.admin, false)
    expect(unpauseResult).toEqual({ value: false })
    expect(mock.paused).toBe(false)
  })

  it("prevents non-admin from pausing", () => {
    const result = mock.setPaused(userA, true)
    expect(result).toEqual({ error: 100 })
  })
})
