#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod crudapp2 {
    use super::*;

  pub fn close(_ctx: Context<CloseCrudapp2>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.crudapp2.count = ctx.accounts.crudapp2.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.crudapp2.count = ctx.accounts.crudapp2.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeCrudapp2>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.crudapp2.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeCrudapp2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Crudapp2::INIT_SPACE,
  payer = payer
  )]
  pub crudapp2: Account<'info, Crudapp2>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseCrudapp2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub crudapp2: Account<'info, Crudapp2>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub crudapp2: Account<'info, Crudapp2>,
}

#[account]
#[derive(InitSpace)]
pub struct Crudapp2 {
  count: u8,
}
