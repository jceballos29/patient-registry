import { PrismaClient, Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg({
  connectionString,
})

const prisma = new PrismaClient({
  adapter,
});

const paymentMethods: Prisma.PaymentMethodCreateInput[] = [
  {
    id: 'cmi9e0j3o0003206g4r7w6h5s',
    name: 'Efectivo',
  },
  {
    id: 'cmi9e0t5o0004206gq3z1v4k3',
    name: 'Transferencia',
  },
  {
    id: 'cmi9e0z1o0005206gch8x7y2n',
    name: 'Nequi',
  }
]

const insurersData: Prisma.InsurerCreateInput[] = [
  {
    id: 'cmi9d48nn0000206g7myyugxs',
    name: 'Colmedica',
  },
  {
    id: 'cmi9dafz80007206ggfyznjyz',
    name: 'Seguros Bolivar',
  },
]

const patientsData: Prisma.PatientCreateInput[] = [
  {
    id: 'cmi8yay5k0000g4lepwm3mg9m',
    name: 'Otro Paciente Prueba',
    documentType: 'CC',
    document: '7539514560',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9d48nn0000206g7myyugxs' } },
    enteredAt: '2024-07-15T10:23:12.000Z',
    createdAt: '2025-11-21T14:23:59.336Z',
    updatedAt: '2025-11-21T20:10:30.813Z'
  },
  {
    id: 'cmi8cukgs0009pfleph6qx9ks',
    name: 'Emilio Castillo Pineda',
    documentType: 'XDE',
    document: '8012345679',
    type: 'SESSIONS',
    enteredAt: '2025-03-02T15:12:45.000Z',
    createdAt: '2025-11-21T04:23:23.164Z',
    updatedAt: '2025-11-21T04:23:23.164Z'
  },
  {
    id: 'cmi8ctzop0008pflennerq583',
    name: 'Lucía Fernández Ríos',
    documentType: 'TI',
    document: '9023456781',
    type: 'SESSIONS',
    enteredAt: '2024-10-28T08:45:00.000Z',
    createdAt: '2025-11-21T04:22:56.233Z',
    updatedAt: '2025-11-21T04:22:56.233Z'
  },
  {
    id: 'cmi8ct9fq0007pfleu175ugsa',
    name: 'Samuel Ramírez Vargas',
    documentType: 'CC',
    document: '1045678912',
    type: 'SESSIONS',
    enteredAt: '2025-06-19T13:30:00.000Z',
    createdAt: '2025-11-21T04:22:22.214Z',
    updatedAt: '2025-11-21T04:22:22.214Z'
  },
  {
    id: 'cmi8cspaq0006pfle2z4cg4oy',
    name: 'Isabella Sánchez Ruiz',
    documentType: 'RC',
    document: '2012345678',
    type: 'SESSIONS',
    enteredAt: '2024-12-05T17:00:00.000Z',
    createdAt: '2025-11-21T04:21:56.114Z',
    updatedAt: '2025-11-21T04:21:56.114Z'
  },
  {
    id: 'cmi8cs7wv0005pfle65i12eod',
    name: 'Mateo Jiménez Castro',
    documentType: 'XDE',
    document: '8004567890',
    type: 'SESSIONS',
    enteredAt: '2025-08-10T09:15:00.000Z',
    createdAt: '2025-11-21T04:21:33.583Z',
    updatedAt: '2025-11-21T04:21:33.583Z'
  },
  {
    id: 'cmi8crqnx0004pfle1590vtil',
    name: 'Laura García Mendoza',
    documentType: 'TI',
    document: '9012345678',
    type: 'SESSIONS',
    enteredAt: '2024-05-22T11:00:00.000Z',
    createdAt: '2025-11-21T04:21:11.229Z',
    updatedAt: '2025-11-21T04:21:11.229Z'
  },
  {
    id: 'cmi8cr3q60003pfle4wh2b9n5',
    name: 'Santiago López Herrera',
    documentType: 'CC',
    document: '1056789123',
    type: 'SESSIONS',
    enteredAt: '2024-11-11T14:30:00.000Z',
    createdAt: '2025-11-21T04:20:41.502Z',
    updatedAt: '2025-11-21T04:20:41.502Z'
  },
  {
    id: 'cmi8cqeba0002pfleypqvdxrz',
    name: 'Valentina Torres Ramírez',
    documentType: 'RC',
    document: '2003456781',
    type: 'SESSIONS',
    enteredAt: '2025-01-18T10:00:00.000Z',
    createdAt: '2025-11-21T04:20:08.566Z',
    updatedAt: '2025-11-21T04:20:08.566Z'
  },
  {
    id: 'cmi8cpvop0001pfle9t191jb4',
    name: 'Juan David Martínez Gómez',
    documentType: 'TI',
    document: '9001234567',
    type: 'SESSIONS',
    enteredAt: '2024-08-23T16:00:00.000Z',
    createdAt: '2025-11-21T04:19:44.425Z',
    updatedAt: '2025-11-21T04:19:44.425Z'
  },
  {
    id: 'cmi8cpgy40000pflele46a86g',
    name: 'Camila Rodríguez Pérez',
    documentType: 'CC',
    document: '1032456789',
    type: 'SESSIONS',
    enteredAt: '2024-09-12T12:00:00.000Z',
    createdAt: '2025-11-21T04:19:25.324Z',
    updatedAt: '2025-11-21T04:19:25.324Z'
  },
  {
    id: 'cmi8c44pk00018alefvmx0a9v',
    name: 'Martín Nova',
    documentType: 'RC',
    document: '1014789321',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9d48nn0000206g7myyugxs' } },
    enteredAt: '2024-04-10T09:00:00.000Z',
    createdAt: '2025-11-21T04:02:49.688Z',
    updatedAt: '2025-11-21T04:02:49.688Z'
  },
  {
    id: 'cmi8c3djw00008aleilhr38ho',
    name: 'Gabriela Nova',
    documentType: 'RC',
    document: '1014369741',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9d48nn0000206g7myyugxs' } },
    enteredAt: '2025-07-29T11:00:00.000Z',
    createdAt: '2025-11-21T04:02:14.492Z',
    updatedAt: '2025-11-21T04:02:14.492Z'
  },
  {
    id: 'cmi8bovtw0009j8ler1u7utoe',
    name: 'Gabriel Galviz',
    documentType: 'TI',
    document: '1015489765',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9d48nn0000206g7myyugxs' } },
    enteredAt: '2024-11-22T13:00:00.000Z',
    createdAt: '2025-11-21T03:50:58.340Z',
    updatedAt: '2025-11-21T03:50:58.340Z'
  },
  {
    id: 'cmi8bo1si0008j8le117epeg9',
    name: 'Andrés Felipe Rey',
    documentType: 'TI',
    document: '1014875624',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9d48nn0000206g7myyugxs' } },
    enteredAt: '2025-05-05T15:00:00.000Z',
    createdAt: '2025-11-21T03:50:19.410Z',
    updatedAt: '2025-11-21T03:50:19.410Z'
  },
  {
    id: 'cmi8bi5ve0007j8lens3193y7',
    name: 'Salomón Martínez Moreno',
    documentType: 'RC',
    document: '1014901419',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9d48nn0000206g7myyugxs' } },
    enteredAt: '2024-06-18T10:00:00.000Z',
    createdAt: '2025-11-21T03:45:44.762Z',
    updatedAt: '2025-11-21T03:45:44.762Z'
  },
  {
    id: 'cmi8bgr2f0006j8le9vp2h7hl',
    name: 'Guadalupe Otalora Plazas',
    documentType: 'TI',
    document: '1014893155',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9dafz80007206ggfyznjyz' } },
    enteredAt: '2024-08-01T09:00:00.000Z',
    createdAt: '2025-11-21T03:44:38.919Z',
    updatedAt: '2025-11-21T03:44:38.919Z'
  },
  {
    id: 'cmi8bfuh40005j8lew4sl23mr',
    name: 'Martina Aurora Soto Maitchouko',
    documentType: 'XDE',
    document: '312798',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9dafz80007206ggfyznjyz' } },
    enteredAt: '2025-08-25T14:00:00.000Z',
    createdAt: '2025-11-21T03:43:56.680Z',
    updatedAt: '2025-11-21T03:43:56.680Z'
  },
  {
    id: 'cmi8bem2u0004j8le79pquumg',
    name: 'Maria José Cely Daza',
    documentType: 'RC',
    document: '1014896978',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9dafz80007206ggfyznjyz' } },
    enteredAt: '2024-05-30T11:00:00.000Z',
    createdAt: '2025-11-21T03:42:59.142Z',
    updatedAt: '2025-11-21T03:42:59.142Z'
  },
  {
    id: 'cmi8bdmod0003j8leej7qq9o9',
    name: 'Joaquin Bautista Calderon',
    documentType: 'RC',
    document: '1141528158',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9dafz80007206ggfyznjyz' } },
    enteredAt: '2024-10-03T13:00:00.000Z',
    createdAt: '2025-11-21T03:42:13.260Z',
    updatedAt: '2025-11-21T03:42:13.260Z'
  },
  {
    id: 'cmi8bcyn70002j8lebi75orkf',
    name: 'Valentino Castro Arenas',
    documentType: 'RC',
    document: '1013280621',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9dafz80007206ggfyznjyz' } },
    enteredAt: '2025-06-01T10:00:00.000Z',
    createdAt: '2025-11-21T03:41:42.115Z',
    updatedAt: '2025-11-21T03:41:42.115Z'
  },
  {
    id: 'cmi88hj4p0001j8lepz1evjvg',
    name: 'Paola García',
    documentType: 'CC',
    document: '1014241844',
    type: 'AUTHORIZATIONS',
    insurer: { connect: { id: 'cmi9dafz80007206ggfyznjyz' } },
    enteredAt: '2024-09-20T09:00:00.000Z',
    createdAt: '2025-11-21T02:21:16.441Z',
    updatedAt: '2025-11-21T02:21:16.441Z'
  },
  {
    id: 'cmi886lu50000j8leavaid9fv',
    name: 'Juan Ceballos',
    documentType: 'CC',
    document: '1037636445',
    type: 'SESSIONS',
    insurer: { connect: { id: 'cmi9dafz80007206ggfyznjyz' } },
    enteredAt: '2025-04-14T12:00:00.000Z',
    createdAt: '2025-11-21T02:12:46.733Z',
    updatedAt: '2025-11-21T02:12:46.733Z'
  }
]

export async function main() {
  console.log("Seeding payment methods...");
  for (const method of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { id: method.id },
      update: {},
      create: method,
    });
  }

  console.log("Seeding insurers...");
  for (const insurer of insurersData) {
    if (insurer.id) {
      await prisma.insurer.upsert({
        where: { id: insurer.id },
        update: {},
        create: insurer,
      });
    } else {
      await prisma.insurer.create({
        data: insurer,
      });
    }
  }

  console.log("Seeding patients...");
  for (const patient of patientsData) {
    await prisma.patient.upsert({
      where: { id: patient.id },
      update: {},
      create: patient,
    });
  }

  console.log("Seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
