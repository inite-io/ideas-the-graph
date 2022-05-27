import { BigInt } from "@graphprotocol/graph-ts"
import {
  IniteNFT,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Transfer
} from "../generated/IniteNFT/IniteNFT"
import { NFTToken, User } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.TOTAL_SUPPLY(...)
  // - contract.balanceOf(...)
  // - contract.baseTokenURI(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.mintTo(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.payments(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfer(event: Transfer): void {
  let token = NFTToken.load(event.params.tokenId.toString());
  if (!token) {
    token = new NFTToken(event.params.tokenId.toString());
    
    let tokenContract = IniteNFT.bind(event.address);
    token.creator = event.params.to.toHexString();
    token.token_id = event.params.tokenId;
    const owner = tokenContract.ownerOf(token.token_id);

    // when new token generated creator is owner
    token.owner = owner.toHexString();

  } else {
    // if token is not new but transfer is ongoing
    token = new NFTToken(event.params.tokenId.toString());
    
    let tokenContract = IniteNFT.bind(event.address);
    token.token_id = event.params.tokenId;
    const owner = tokenContract.ownerOf(token.token_id);
    token.owner = owner.toHexString();
  }

  token.save();

  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}
