import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

const initialBalance = 500;
const moreThanBalance = 501;
const transferAmount = 50;
const account = getBankAccount(initialBalance);
const toAccount = getBankAccount(initialBalance);

jest.mock('lodash');

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(moreThanBalance)).toThrowError(
      new InsufficientFundsError(initialBalance),
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(moreThanBalance, toAccount)).toThrowError(
      new InsufficientFundsError(initialBalance),
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(initialBalance, account)).toThrowError(
      new TransferFailedError(),
    );
  });

  test('should deposit money', () => {
    const depositAccount = getBankAccount(initialBalance);
    depositAccount.deposit(transferAmount);
    expect(depositAccount.getBalance()).toBe(initialBalance + transferAmount);
  });

  test('should withdraw money', () => {
    const withDrawAccount = getBankAccount(initialBalance);
    withDrawAccount.withdraw(transferAmount);
    expect(withDrawAccount.getBalance()).toBe(initialBalance - transferAmount);
  });

  test('should transfer money', () => {
    const fromBankAccount = getBankAccount(initialBalance);
    const toBankAccount = getBankAccount(initialBalance);
    fromBankAccount.transfer(transferAmount, toBankAccount);
    expect(fromBankAccount.getBalance()).toBe(initialBalance - transferAmount);
    expect(toBankAccount.getBalance()).toBe(initialBalance + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock).mockReturnValueOnce(42).mockReturnValueOnce(1);
    const balance = await account.fetchBalance();
    expect(balance).toBe(42);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (random as jest.Mock).mockReturnValueOnce(42).mockReturnValueOnce(1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(42);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock).mockReturnValueOnce(42).mockReturnValueOnce(0);
    await expect(account.synchronizeBalance()).rejects.toThrowError(
      new SynchronizationFailedError(),
    );
  });
});
