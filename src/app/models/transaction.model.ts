export class Transaction {
  constructor(
    public Address: string,
    public Txid: string,
    public Type: string,
    public Value: number,
    public CreateTime: number, 
    public Height: number,
    public Fee: number,
    public Inputs: string[],
    public Outputs: string[],
    public TxType: string,
    public Memo: string
  ) {}
}