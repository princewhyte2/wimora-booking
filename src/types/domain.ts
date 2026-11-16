export type Service = {
  readonly name: string;
  readonly price: number;
  readonly minutes: number;
};

export type Braider = {
  readonly id: string;
  readonly name: string;
  readonly specialty: string;
  readonly rating: number;
  readonly priceFrom: number;
  readonly location: string;
  readonly services: readonly Service[];
  readonly slots: readonly string[];
};

export type BookingRequest = {
  braiderId: string;
  serviceName: string;
  slot: string;
  customerName: string;
  customerPhone: string;
};

/**
 * A confirmed booking. Braider and service details are snapshotted at booking
 * time (like a receipt) so the summary stays accurate if the catalogue changes.
 */
export type Booking = {
  id: string;
  reference: string;
  createdAt: string;
  braider: Pick<Braider, 'id' | 'name' | 'location'>;
  service: Service;
  slot: string;
  customer: {
    name: string;
    phone: string;
  };
};
