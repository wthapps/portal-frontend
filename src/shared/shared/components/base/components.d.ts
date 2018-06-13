export interface ModalComponent {
  modal: any;

  close(): void;
  save(e?: any): void;
  open(options?: any): void;
}

export interface ModalActions {
  close(): void;
  save(e?: any): void;
  open(options?: any): void;
}
