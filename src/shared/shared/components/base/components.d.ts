export interface ModalComponent {
  modal: any;

  close(): void;
  save(e?: any): void;
  open(config?: any): void;
}
