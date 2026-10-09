import { ClientRequest, BackendStats } from './types.js';
import { Booking, QuoteEstimate, Invoice, GardenPlant, UserProfile } from '../src/types.js';

class BackendStore {
  clientRequests: ClientRequest[] = [
    {
      id: 'req-101',
      referenceNo: 'REQ-2026-0041',
      clientName: 'Lady Catherine Danbury',
      clientEmail: 'catherine.danbury@cotswolds-estates.co.uk',
      clientPhone: '+44 7700 900219',
      propertyAddress: 'Danbury Manor, Lower Slaughter',
      postcode: 'GL54 2HS',
      type: 'emergency_clearance',
      title: 'Storm Overhaul & Fallen Beech Branch Removal',
      description: 'Heavy gale winds snapped a mature copper beech bough across the main gravel carriage drive. Requires arboricultural chainsaw clearance and chipping.',
      status: 'under_review',
      priority: 'urgent',
      assignedStaff: 'Callum Brooks (Senior Groundsman)',
      requestedDate: '2026-10-10',
      preferredTimeSlot: 'morning',
      estimatedValue: 280,
      yardDimensions: 'Acreage / Private Woodland edge',
      servicesRequested: ['Full Garden Clearance', 'Tree Lopping & Pruning'],
      internalNotes: [
        'Checked highway proximity - private driveway only.',
        'Callum assigned with Stihl MS 261 chainsaw & woodchipper trailer.',
      ],
      createdAt: '2026-10-07T09:15:00Z',
      updatedAt: '2026-10-07T10:30:00Z',
    },
    {
      id: 'req-102',
      referenceNo: 'REQ-2026-0042',
      clientName: 'Eleanor Vance',
      clientEmail: 'eleanor.vance@cotswolds.co.uk',
      clientPhone: '+44 7700 900142',
      propertyAddress: 'High Meadow House, Willow Lane, Chipping Campden',
      postcode: 'GL55 6HB',
      type: 'booking',
      title: 'Precision Autumn Lawn Cylinder Cut & Hornbeam Trimming',
      description: 'Regular seasonal maintenance visit for front formal lawns and side mixed borders.',
      status: 'scheduled',
      priority: 'normal',
      assignedStaff: 'Callum Brooks (Senior Groundsman)',
      requestedDate: '2026-10-12',
      preferredTimeSlot: 'morning',
      estimatedValue: 145,
      yardDimensions: '180 sq meters formal turf',
      servicesRequested: ['Precision Lawn Mowing & Striping', 'Hedge Sculpting & Topiary Trimming'],
      associatedBookingId: 'book-101',
      associatedQuoteId: 'quote-201',
      associatedInvoiceId: 'inv-301',
      internalNotes: [
        'Side gate combination confirmed: 4821.',
        'Client golden retriever will be kept indoors.',
      ],
      createdAt: '2026-10-05T14:20:00Z',
      updatedAt: '2026-10-06T08:00:00Z',
    },
    {
      id: 'req-103',
      referenceNo: 'REQ-2026-0043',
      clientName: 'Lord Henry Sterling',
      clientEmail: 'henry@sterlinghall.co.uk',
      clientPhone: '+44 7700 900334',
      propertyAddress: 'Sterling Manor, Broadway Road, Gloucestershire',
      postcode: 'WR12 7AA',
      type: 'quote_estimation',
      title: 'Victorian Walled Kitchen Garden Soil Enrichment & Mulching',
      description: 'Requires complete bed clear-out, excavation of deep-rooted weeds, and spreading 3 bulk bags of rich organic mushroom compost.',
      status: 'in_progress',
      priority: 'high',
      assignedStaff: 'Callum Brooks & Toby Miller',
      requestedDate: '2026-10-15',
      preferredTimeSlot: 'full_day',
      estimatedValue: 360,
      yardDimensions: '320 sq meters walled garden',
      servicesRequested: ['Full Garden Clearance', 'Herbaceous Planting & Organic Mulch'],
      associatedBookingId: 'book-102',
      internalNotes: [
        'Compost bulk bags delivered to service entrance gate 2.',
        'Work currently underway in vegetable quadrant.',
      ],
      createdAt: '2026-10-06T11:00:00Z',
      updatedAt: '2026-10-08T07:15:00Z',
    },
    {
      id: 'req-104',
      referenceNo: 'REQ-2026-0044',
      clientName: 'Dr. Alistair Finch',
      clientEmail: 'afinch@oxfordbotany.org',
      clientPhone: '+44 7700 900551',
      propertyAddress: '42 Primrose Cottage, Burford',
      postcode: 'OX18 4RA',
      type: 'planting_consultation',
      title: 'Heritage Rose Garden Subsurface Irrigation Architecture',
      description: 'Consultation to map automated moisture sensors and drip line manifold along historic stone pergola.',
      status: 'new',
      priority: 'normal',
      assignedStaff: 'Toby Miller (Topiary & Irrigation Specialist)',
      requestedDate: '2026-10-18',
      preferredTimeSlot: 'afternoon',
      estimatedValue: 220,
      yardDimensions: '95 sq meters cottage borders',
      servicesRequested: ['Smart Drip Irrigation & Rain Sensors'],
      associatedBookingId: 'book-103',
      internalNotes: ['Requires pressure test of outdoor brass bibcock.'],
      createdAt: '2026-10-07T16:45:00Z',
      updatedAt: '2026-10-07T16:45:00Z',
    },
    {
      id: 'req-105',
      referenceNo: 'REQ-2026-0045',
      clientName: 'Mrs. Penelope Featherstone',
      clientEmail: 'penelope.f@bourton-water.co.uk',
      clientPhone: '+44 7700 900892',
      propertyAddress: 'Millrace Cottage, Bourton-on-the-Water',
      postcode: 'GL54 2BY',
      type: 'turf_installation',
      title: 'Riverfront Lawn Excavation & Stadium Turf Grading',
      description: 'Lawn suffers waterlogging near river weir. Needs sub-base gravel drainage ditch and fine turf re-grading.',
      status: 'new',
      priority: 'high',
      requestedDate: '2026-10-22',
      preferredTimeSlot: 'morning',
      estimatedValue: 490,
      yardDimensions: '140 sq meters riverfront bank',
      servicesRequested: ['Premium Turf Laying & Grading'],
      internalNotes: ['Awaiting site surveyor inspection.'],
      createdAt: '2026-10-08T06:30:00Z',
      updatedAt: '2026-10-08T06:30:00Z',
    },
  ];

  bookings: Booking[] = [
    {
      id: 'book-101',
      bookingRef: 'PG-2026-1082',
      customerName: 'Eleanor Vance',
      customerEmail: 'eleanor.vance@cotswolds.co.uk',
      customerPhone: '+44 7700 900142',
      address: 'High Meadow House, Willow Lane, Chipping Campden, GL55 6HB',
      serviceIds: ['srv-lawn', 'srv-hedge'],
      date: '2026-10-12',
      timeSlot: 'morning',
      status: 'confirmed',
      notes: 'Front lawn stripe cut and rear hornbeam hedge height reduction by 1 foot.',
      totalEstimate: 145,
      assignedGardener: 'Callum Brooks (Senior Groundsman)',
      checklist: {
        'Lawn cylinder cut & line trim': false,
        'Hornbeam hedge reduction': false,
        'Sweep and blow stone pathways': false,
        'Deposit green waste into compost bay': false,
      },
      createdAt: '2026-10-05',
    },
    {
      id: 'book-102',
      bookingRef: 'PG-2026-1083',
      customerName: 'Lord Henry Sterling',
      customerEmail: 'henry@sterlinghall.co.uk',
      customerPhone: '+44 7700 900334',
      address: 'Sterling Manor, Broadway Road, Gloucestershire',
      serviceIds: ['srv-clearance', 'srv-planting'],
      date: '2026-10-15',
      timeSlot: 'full_day',
      status: 'in_progress',
      notes: 'Walled Victorian kitchen garden winter clear-out and organic bark dressing.',
      totalEstimate: 360,
      assignedGardener: 'Callum Brooks & Toby Miller',
      checklist: {
        'Bramble root excavation': true,
        'Old vegetable beds cleared': true,
        'Spread 3 cubic yards mushroom compost': false,
        'Mulch perimeter borders': false,
      },
      createdAt: '2026-10-06',
    },
    {
      id: 'book-103',
      bookingRef: 'PG-2026-1084',
      customerName: 'Dr. Alistair Finch',
      customerEmail: 'afinch@oxfordbotany.org',
      customerPhone: '+44 7700 900551',
      address: '42 Primrose Cottage, Burford, OX18 4RA',
      serviceIds: ['srv-irrigation'],
      date: '2026-10-18',
      timeSlot: 'afternoon',
      status: 'pending',
      notes: 'Install 2-zone Wi-Fi drip system for heritage rose collection.',
      totalEstimate: 220,
      createdAt: '2026-10-07',
    },
  ];

  quotes: QuoteEstimate[] = [
    {
      id: 'quote-201',
      quoteRef: 'QUO-8841',
      customerName: 'Eleanor Vance',
      customerEmail: 'eleanor.vance@cotswolds.co.uk',
      propertyAddress: 'High Meadow House, Willow Lane, Chipping Campden',
      gardenSizeDesc: 'Large English Cottage Garden (approx 280 sq meters)',
      assessmentSummary: 'Established lawns with slight thatch accumulation. Perimeter mixed hedges require autumnal leveling, and herbaceous borders need seasonal weed extraction and 3-inch compost mulching.',
      difficultyRating: 'Moderate',
      estimatedHours: 5.5,
      recommendedCrewSize: 2,
      lineItems: [
        {
          id: 'li-1',
          description: 'Lawn Aeration, Roller Striping & Precision Edging',
          category: 'Lawn Care',
          quantity: 280,
          unit: 'm²',
          unitPrice: 0.38,
          total: 106.40,
        },
        {
          id: 'li-2',
          description: 'Formal Hornbeam & Privet Hedge Face Dressing',
          category: 'Hedge Care',
          quantity: 3.0,
          unit: 'hours',
          unitPrice: 42.00,
          total: 126.00,
        },
        {
          id: 'li-3',
          description: 'Seasonal Border Weeding & Organic Bark Mulch Layer',
          category: 'Borders & Beds',
          quantity: 2,
          unit: 'bulk bags',
          unitPrice: 65.00,
          total: 130.00,
        },
        {
          id: 'li-4',
          description: 'Certified Green Waste Compost Recycling Fee',
          category: 'Disposal',
          quantity: 1,
          unit: 'van load',
          unitPrice: 45.00,
          total: 45.00,
        },
      ],
      wasteVolumeBags: 6,
      subtotal: 407.40,
      greenWasteFee: 45.00,
      taxVat: 81.48,
      total: 488.88,
      equipmentRecommended: ['Allett Cylinder Mower', 'Stihl Long-reach Pruner', 'Pneumatic Wheelbarrows'],
      proGardenerTips: [
        'Top-dress shaded turf zones with horticultural sharp sand before winter frost.',
        'Leave seed heads on Echinacea and Hydrangeas for beneficial winter wildlife habitat.',
      ],
      status: 'invoiced',
      createdAt: '2026-10-02',
      expiresAt: '2026-11-02',
    },
  ];

  invoices: Invoice[] = [
    {
      id: 'inv-301',
      invoiceNumber: 'INV-2026-0924',
      quoteId: 'quote-201',
      customerName: 'Eleanor Vance',
      customerEmail: 'eleanor.vance@cotswolds.co.uk',
      customerAddress: 'High Meadow House, Willow Lane, Chipping Campden, GL55 6HB',
      issueDate: '2026-10-03',
      dueDate: '2026-10-17',
      lineItems: [
        {
          id: 'li-1',
          description: 'Lawn Aeration, Roller Striping & Precision Edging',
          category: 'Lawn Care',
          quantity: 280,
          unit: 'm²',
          unitPrice: 0.38,
          total: 106.40,
        },
        {
          id: 'li-2',
          description: 'Formal Hornbeam & Privet Hedge Face Dressing',
          category: 'Hedge Care',
          quantity: 3.0,
          unit: 'hours',
          unitPrice: 42.00,
          total: 126.00,
        },
        {
          id: 'li-3',
          description: 'Seasonal Border Weeding & Organic Bark Mulch Layer',
          category: 'Borders & Beds',
          quantity: 2,
          unit: 'bulk bags',
          unitPrice: 65.00,
          total: 130.00,
        },
        {
          id: 'li-4',
          description: 'Certified Green Waste Compost Recycling Fee',
          category: 'Disposal',
          quantity: 1,
          unit: 'van load',
          unitPrice: 45.00,
          total: 45.00,
        },
      ],
      subtotal: 407.40,
      greenWasteFee: 45.00,
      taxVat: 81.48,
      total: 488.88,
      paymentStatus: 'unpaid',
    },
  ];

  plants: GardenPlant[] = [
    {
      id: 'plant-1',
      x: 1,
      y: 1,
      speciesName: 'English Lavender',
      botanicalName: 'Lavandula angustifolia "Hidcote"',
      category: 'shrub',
      health: 'thriving',
      sunlight: 'full_sun',
      waterCadenceDays: 5,
      lastWatered: '2026-10-04',
      plantedDate: '2025-04-12',
      notes: 'Heavy purple blooms. Attracts high bumblebee traffic.',
      arScale: 1.0,
      bloomSeason: 'Mid Summer to Early Autumn',
    },
    {
      id: 'plant-2',
      x: 3,
      y: 1,
      speciesName: 'Annabelle Hydrangea',
      botanicalName: 'Hydrangea arborescens',
      category: 'shrub',
      health: 'needs_water',
      sunlight: 'partial_shade',
      waterCadenceDays: 2,
      lastWatered: '2026-10-02',
      notes: 'Massive white globe blossoms; requires deep weekly soaking.',
      arScale: 1.3,
      bloomSeason: 'Summer to Frost',
    },
    {
      id: 'plant-3',
      x: 8,
      y: 2,
      speciesName: 'Japanese Maple',
      botanicalName: 'Acer palmatum "Bloodgood"',
      category: 'tree',
      health: 'thriving',
      sunlight: 'partial_shade',
      waterCadenceDays: 7,
      lastWatered: '2026-10-01',
      notes: 'Deep crimson lacy foliage. Sheltered from bitter north winds.',
      arScale: 1.4,
      bloomSeason: 'Spring - Autumn foliage',
    },
    {
      id: 'plant-4',
      x: 10,
      y: 1,
      speciesName: 'Boxwood Topiary Sphere',
      botanicalName: 'Buxus sempervirens',
      category: 'shrub',
      health: 'prune_due',
      sunlight: 'partial_shade',
      waterCadenceDays: 6,
      lastWatered: '2026-10-03',
      notes: 'Formal clipped sphere at patio terrace entrance.',
      arScale: 1.1,
      bloomSeason: 'Evergreen architectural',
    },
    {
      id: 'plant-5',
      x: 2,
      y: 5,
      speciesName: 'Culinary Rosemary & Thyme',
      botanicalName: 'Salvia rosmarinus',
      category: 'herb',
      health: 'thriving',
      sunlight: 'full_sun',
      waterCadenceDays: 6,
      lastWatered: '2026-10-05',
      notes: 'Raised stone herb bed. Free draining gravel mulch.',
      arScale: 0.9,
      bloomSeason: 'Spring to Autumn',
    },
    {
      id: 'plant-6',
      x: 6,
      y: 4,
      speciesName: 'Wildflower Bee Meadow',
      botanicalName: 'Papaver rhoeas & Centaurea cyanus',
      category: 'flower',
      health: 'good',
      sunlight: 'full_sun',
      waterCadenceDays: 4,
      lastWatered: '2026-10-04',
      notes: 'Native British cornfield mix. Poppies, cornflowers, and oxeye daisies.',
      arScale: 1.0,
      bloomSeason: 'May to October',
    },
  ];

  // Client Requests methods
  getAllRequests(filters?: { status?: string; type?: string; priority?: string; query?: string }): ClientRequest[] {
    let result = [...this.clientRequests];
    if (filters?.status && filters.status !== 'all') {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters?.type && filters.type !== 'all') {
      result = result.filter((r) => r.type === filters.type);
    }
    if (filters?.priority && filters.priority !== 'all') {
      result = result.filter((r) => r.priority === filters.priority);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (r) =>
          r.clientName.toLowerCase().includes(q) ||
          r.referenceNo.toLowerCase().includes(q) ||
          r.propertyAddress.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getRequestById(id: string): ClientRequest | undefined {
    return this.clientRequests.find((r) => r.id === id);
  }

  createRequest(data: Partial<ClientRequest>): ClientRequest {
    const newReq: ClientRequest = {
      id: `req-${Date.now()}`,
      referenceNo: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: data.clientName || 'Anonymous Estate Client',
      clientEmail: data.clientEmail || 'client@example.co.uk',
      clientPhone: data.clientPhone || '+44 7700 900000',
      propertyAddress: data.propertyAddress || 'Gloucestershire Estate',
      postcode: data.postcode || 'GL54 1AA',
      type: data.type || 'booking',
      title: data.title || 'Client Garden Request',
      description: data.description || 'Request submitted through client portal.',
      status: data.status || 'new',
      priority: data.priority || 'normal',
      assignedStaff: data.assignedStaff,
      requestedDate: data.requestedDate || new Date().toISOString().split('T')[0],
      preferredTimeSlot: data.preferredTimeSlot || 'morning',
      estimatedValue: data.estimatedValue || 0,
      yardDimensions: data.yardDimensions,
      servicesRequested: data.servicesRequested || [],
      internalNotes: data.internalNotes || ['Logged automatically from client portal.'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.clientRequests.unshift(newReq);
    return newReq;
  }

  updateRequest(id: string, updates: Partial<ClientRequest>): ClientRequest | null {
    const idx = this.clientRequests.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const existing = this.clientRequests[idx];
    const updated: ClientRequest = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      internalNotes: updates.internalNotes
        ? [...(existing.internalNotes || []), ...updates.internalNotes]
        : existing.internalNotes,
    };
    this.clientRequests[idx] = updated;
    return updated;
  }

  deleteRequest(id: string): boolean {
    const initial = this.clientRequests.length;
    this.clientRequests = this.clientRequests.filter((r) => r.id !== id);
    return this.clientRequests.length < initial;
  }

  // Bookings methods
  getAllBookings(): Booking[] {
    return [...this.bookings];
  }

  createBooking(booking: Booking): Booking {
    this.bookings.unshift(booking);

    // Synchronize to backend client requests so staff can triage and assign!
    this.createRequest({
      clientName: booking.customerName,
      clientEmail: booking.customerEmail,
      clientPhone: booking.customerPhone,
      propertyAddress: booking.address,
      type: 'booking',
      title: `Scheduled Service Booking (${booking.bookingRef})`,
      description: booking.notes,
      status: booking.status === 'confirmed' ? 'scheduled' : 'new',
      priority: 'normal',
      assignedStaff: booking.assignedGardener,
      requestedDate: booking.date,
      preferredTimeSlot: booking.timeSlot,
      estimatedValue: booking.totalEstimate,
      associatedBookingId: booking.id,
      servicesRequested: booking.serviceIds,
      internalNotes: [`Created from client calendar booking ref: ${booking.bookingRef}`],
    });

    return booking;
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const idx = this.bookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.bookings[idx] = { ...this.bookings[idx], ...updates };
    return this.bookings[idx];
  }

  // Quotes methods
  getAllQuotes(): QuoteEstimate[] {
    return [...this.quotes];
  }

  getQuoteById(id: string): QuoteEstimate | null {
    return this.quotes.find((q) => q.id === id) || null;
  }

  updateQuote(id: string, updates: Partial<QuoteEstimate>): QuoteEstimate | null {
    const idx = this.quotes.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    this.quotes[idx] = { ...this.quotes[idx], ...updates };
    return this.quotes[idx];
  }

  createQuote(quote: QuoteEstimate): QuoteEstimate {
    this.quotes.unshift(quote);

    // Log corresponding client request
    this.createRequest({
      clientName: quote.customerName,
      clientEmail: quote.customerEmail,
      propertyAddress: quote.propertyAddress,
      type: 'quote_estimation',
      title: `Horticultural AI Quotation (${quote.quoteRef})`,
      description: quote.assessmentSummary,
      status: 'quote_sent',
      priority: quote.difficultyRating.toLowerCase().includes('heavy') ? 'high' : 'normal',
      estimatedValue: quote.total,
      yardDimensions: quote.gardenSizeDesc,
      associatedQuoteId: quote.id,
      internalNotes: [
        `Gemini 3.8 Flash estimated: £${quote.total.toFixed(2)} (${quote.estimatedHours} crew hours)`,
      ],
    });

    return quote;
  }

  // Invoices methods
  getAllInvoices(): Invoice[] {
    return [...this.invoices];
  }

  getInvoiceById(id: string): Invoice | null {
    return this.invoices.find((i) => i.id === id) || null;
  }

  createInvoice(invoice: Invoice): Invoice {
    this.invoices.unshift(invoice);
    return invoice;
  }

  payInvoice(id: string, paymentMethod: string = 'stripe_card'): Invoice | null {
    const idx = this.invoices.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.invoices[idx] = {
      ...this.invoices[idx],
      paymentStatus: 'paid',
      paidAt: new Date().toISOString(),
      stripePaymentId: `ch_live_${Math.random().toString(36).substring(2, 10)}`,
      paymentMethod,
    };
    return this.invoices[idx];
  }

  // Users methods & storage
  users: UserProfile[] = [
    {
      id: 'usr-customer-1',
      name: 'Eleanor Vance',
      email: 'eleanor.vance@cotswolds.co.uk',
      phone: '+44 7700 900142',
      role: 'customer',
      address: 'High Meadow House, Willow Lane, Chipping Campden',
      postcode: 'GL55 6HB',
      gardenSpecs: {
        lawnAreaM2: 180,
        hasHedges: true,
        hasTrees: true,
        petSafeOnly: true,
        organicMulch: true,
        gateAccessCode: '4821',
      },
      notes: 'Please keep the side wooden gate latched at all times due to our golden retriever.',
    },
    {
      id: 'usr-gardener-1',
      name: 'Callum Brooks (Senior Groundsman)',
      email: 'callum@pasturesgardening.co.uk',
      phone: '+44 7700 900881',
      role: 'gardener',
      address: 'Pastures Depot 3, Meadow Way, Cirencester',
      postcode: 'GL7 1AA',
    },
    {
      id: 'usr-admin-1',
      name: 'Margaret Croft (Operations Director)',
      email: 'margaret@pasturesgardening.co.uk',
      phone: '+44 7700 900990',
      role: 'admin',
      address: 'Pastures HQ, Stroud Valley, Gloucestershire',
      postcode: 'GL5 3PQ',
    },
  ];

  transactions: any[] = [
    {
      id: 'txn-001',
      invoiceId: 'inv-301',
      amount: 202.80,
      currency: 'gbp',
      method: 'Stripe Card',
      status: 'succeeded',
      date: '2026-10-06T15:30:00Z',
    },
  ];

  gardens: any[] = [
    {
      id: 'g1',
      name: 'High Meadow House - South Formal Grounds',
      location: 'Chipping Campden, Cotswolds',
      areaM2: 180,
      soil: 'Limestone loam with rich humus top-dressing',
      aspect: 'South-South-West (High natural light)',
      zonesCount: 4,
    },
    {
      id: 'g2',
      name: 'Victorian Walled Herbarium & Orchard',
      location: 'Broadway Road, Gloucestershire',
      areaM2: 95,
      soil: 'Sheltered chalk-clay blend with gravel drainage',
      aspect: 'East facing (Morning sun, sheltered afternoon)',
      zonesCount: 3,
    },
  ];

  getAllUsers(): UserProfile[] {
    return [...this.users];
  }

  getUserById(id: string): UserProfile | null {
    return this.users.find((u) => u.id === id) || null;
  }

  createUser(user: UserProfile): UserProfile {
    this.users.push(user);
    return user;
  }

  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  getAllGardens(): any[] {
    return [...this.gardens];
  }

  getTransactions(): any[] {
    return [...this.transactions];
  }

  logTransaction(txn: any): any {
    this.transactions.unshift(txn);
    return txn;
  }

  // Plants methods
  getAllPlants(): GardenPlant[] {
    return [...this.plants];
  }

  savePlant(plant: GardenPlant): GardenPlant {
    const idx = this.plants.findIndex((p) => p.id === plant.id);
    if (idx >= 0) {
      this.plants[idx] = plant;
    } else {
      this.plants.push(plant);
    }
    return plant;
  }

  waterPlant(id: string): GardenPlant | null {
    const idx = this.plants.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.plants[idx] = {
      ...this.plants[idx],
      health: 'thriving',
      lastWatered: new Date().toISOString().split('T')[0],
    };
    return this.plants[idx];
  }

  // Analytics & Stats
  getBackendStats(): BackendStats {
    const newRequests = this.clientRequests.filter((r) => r.status === 'new').length;
    const underReview = this.clientRequests.filter((r) => r.status === 'under_review').length;
    const scheduled = this.clientRequests.filter((r) => r.status === 'scheduled').length;
    const completed = this.clientRequests.filter((r) => r.status === 'completed').length;

    const totalRevenue = this.invoices.reduce((sum, inv) => sum + inv.total, 0);
    const unpaidRevenue = this.invoices
      .filter((inv) => inv.paymentStatus !== 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalRequests: this.clientRequests.length,
      newRequestsCount: newRequests,
      underReviewCount: underReview,
      scheduledCount: scheduled,
      completedCount: completed,
      totalRevenueGBP: Math.round(totalRevenue * 100) / 100,
      unpaidRevenueGBP: Math.round(unpaidRevenue * 100) / 100,
      activeFieldCrews: 3,
    };
  }
}

export const backendStore = new BackendStore();
