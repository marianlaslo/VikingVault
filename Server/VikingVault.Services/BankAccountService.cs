﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using VikingVault.DataAccess;
using VikingVault.DataAccess.Models;
using VikingVault.Services.Abstractions;
using VikingVault.Services.Exceptions;

namespace VikingVault.Services
{
    public class BankAccountService : IBankAccountService
    {
        private readonly VikingVaultDbContext _dbContext;

        public BankAccountService(VikingVaultDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public BankAccount CreateBankAccount(BankAccount account)
        {
            try
            {
                _dbContext.Add(account);
                _dbContext.SaveChanges();
            }
            catch (Exception e)
            {
                if (e is DbUpdateException || e is DbUpdateConcurrencyException)
                {
                    throw new BankAccountServiceException();
                }
            }
            return account;
        }

        public List<BankAccount> GetBankAccounts(string token)
        {
            var tokenObject = new JwtSecurityToken(token);
            string userId = tokenObject.Payload["Id"].ToString();
            var returnedUser = _dbContext.User.SingleOrDefault(u => u.Id == Int32.Parse(userId));

            var bankAccounts = _dbContext.BankAccount.Where(account => account.User == returnedUser).ToList();
            return bankAccounts;
        }
    }
}
