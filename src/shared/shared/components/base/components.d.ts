export interface ModalComponent {
  modal: any;

  init(config?: any): void;
  close(): void;
  save(): void;
  open(): void;
}
