﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using VikingVault.DataAccess;
using VikingVault.DataAccess.Models;
using VikingVault.Services.Abstractions;
using VikingVault.Services.Exceptions;

namespace VikingVault.Services
{
    public class AutomaticPaymentService : IAutomaticPaymentService
    {
        private readonly VikingVaultDbContext _dbContext;

        public AutomaticPaymentService(VikingVaultDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public AutomaticPayment CreateAutomaticPayment(AutomaticPaymentDTO automaticPaymentDTO)
        {
            AutomaticPayment automaticPaymentToBeCreated = new AutomaticPayment
            {
                Company = _dbContext.User.Find(automaticPaymentDTO.CompanyId),
                Amount = automaticPaymentDTO.Amount,
                InitialPaymentDate = automaticPaymentDTO.InitialPaymentDate,
                LastPaymentDate = automaticPaymentDTO.LastPaymentDate,
                PayingUser = _dbContext.User.Find(automaticPaymentDTO.PayingUserId)
            };
            try
            {
                _dbContext.Add(automaticPaymentToBeCreated);
                _dbContext.SaveChanges();
            }
            catch (DbUpdateException e)
            {
                    throw new AutomaticPaymentServiceException("Database Error");
            }
            return automaticPaymentToBeCreated;
        }

        public AutomaticPayment UpdateAutomaticPayment(AutomaticPaymentDTO automaticPaymentDTO)
        {
            try
            {
                AutomaticPayment automaticPayment = _dbContext.AutomaticPayments.SingleOrDefault(ap => ap.Id == automaticPaymentDTO.Id);
                automaticPayment.Amount = automaticPaymentDTO.Amount;
                automaticPayment.InitialPaymentDate = automaticPaymentDTO.InitialPaymentDate;
                _dbContext.SaveChanges();
                return automaticPayment;
            }
            catch (DbUpdateException e)
            {
                throw new AutomaticPaymentServiceException("Database Error");
            }
        }
    }
}
