﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VikingVault.DataAccess.Models;

namespace VikingVault.DataAccess
{
    public class VikingVaultDbContext: DbContext
    {
        public VikingVaultDbContext(DbContextOptions<VikingVaultDbContext> options)
            : base(options)
        { }
        
        public DbSet<User> User { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<BankAccount> BankAccount { get; set; }
        public DbSet<Card> Cards { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasAlternateKey(c => c.Email)
                .HasName("Email");

            modelBuilder.Entity<Card>()
                .HasAlternateKey(card => card.CardNumber)
                .HasName("AlternateKey_CardNumber");
        }
        public DbSet<Transaction> Transactions { get; set; }
    }
}
