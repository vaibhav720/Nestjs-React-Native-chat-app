export interface IMessage {
  id?: number;
  message: string;
  creatorId: number;
  conversationId?: number;
}
