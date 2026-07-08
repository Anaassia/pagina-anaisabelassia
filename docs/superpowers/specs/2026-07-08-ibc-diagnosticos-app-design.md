# IBC Group — App de Diagnósticos

**Fecha**: 2026-07-08
**Estado**: Aprobado
**Stack**: React + Vite + TailwindCSS + Convex + Convex Auth + Mercado Pago

## Resumen

Migrar el sitio web estático de Ana Isabel Assia (IBC Group) a una aplicación React unificada con backend en Convex. La app incluye las páginas públicas actuales, un sistema de diagnósticos empresariales con pago integrado, un portal de cliente, y un dashboard admin con constructor de productos.

## Contexto

- Sitio actual: 13 páginas HTML estáticas desplegadas en Netlify (anaisabelassia.netlify.app)
- Diagnóstico existente: "Perfil de Liderazgo Comercial Generativo" — 5 ejes, 25 preguntas con pesos, scoring en vivo, análisis IA vía webhook (n8n), PDF con html2pdf.js
- El diagnóstico actual es gratuito; el negocio cobra por mentoría posterior ($250,000 COP/hora)
- No hay persistencia: los resultados se pierden al cerrar el navegador
- Restricción: la máquina no tiene Node.js instalado (se ha usado Docker)

## Objetivos

1. Persistir diagnósticos en base de datos para consulta futura
2. Sistema de cuentas para clientes (email + Google)
3. Pago con Mercado Pago antes del diagnóstico (productos de pago)
4. Productos gratuitos que saltan el paso de pago
5. Dashboard admin para gestionar clientes, pagos, y crear nuevos diagnósticos
6. Constructor de productos: definir ejes, factores, precios, y publicar
7. Link permanente compartible para resultados

## Arquitectura

### Stack

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | React 18 + Vite + TailwindCSS | SPA moderna, rápida, con estilos utilitarios |
| Backend | Convex | DB reactiva, funciones serverless, TypeScript end-to-end |
| Auth | Convex Auth | Email/password + Google OAuth, roles integrados |
| Pagos | Mercado Pago Checkout Pro | Estándar en LATAM, webhooks IPN para confirmar pagos |
| Análisis IA | Webhook externo (n8n) | Se mantiene el webhook actual por producto |
| PDF | html2pdf.js (client-side) | Se mantiene la generación actual |
| Deploy | Netlify (frontend) + Convex Cloud (backend) | Free tier suficiente para inicio |

### Decisión: app unificada

Se migra todo a una sola app React. Las páginas públicas actuales se convierten en componentes React manteniendo el diseño visual. Razones:
- Un solo deploy, un solo repo
- Navegación fluida entre landing y app de diagnósticos
- Estilos compartidos (brand system actual)

## Estructura del proyecto

```
ibc-diagnosticos/
├── src/
│   ├── components/
│   │   ├── ui/                  # Botones, inputs, cards, modals
│   │   ├── layout/              # Header, Footer, Sidebar
│   │   ├── diagnostic/          # DiagnosticForm, AxisSection, ScoreRadar
│   │   └── admin/               # ProductForm, ClientTable, PaymentTable
│   ├── pages/
│   │   ├── public/              # Páginas migradas del sitio actual
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── BlogPost.tsx
│   │   │   ├── Community.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Innovation.tsx
│   │   │   └── Leadership.tsx
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── client/              # Requiere auth role=client
│   │   │   ├── Catalog.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── Diagnostic.tsx
│   │   │   ├── Results.tsx
│   │   │   └── MyDiagnostics.tsx
│   │   └── admin/               # Requiere auth role=admin
│   │       ├── Dashboard.tsx
│   │       ├── ProductBuilder.tsx
│   │       ├── ProductEditor.tsx
│   │       ├── Clients.tsx
│   │       ├── ClientDetail.tsx
│   │       ├── Payments.tsx
│   │       └── Analytics.tsx
│   ├── lib/
│   │   ├── scoring.ts           # Lógica de scoring (migrada)
│   │   ├── charts.ts            # Helpers para radar/barras SVG
│   │   └── pdf.ts               # Generación PDF
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useDiagnostic.ts
│   ├── App.tsx                  # Router principal
│   └── main.tsx                 # Entry point
├── convex/
│   ├── schema.ts                # Modelo de datos
│   ├── auth.ts                  # Config autenticación
│   ├── auth.config.ts
│   ├── users.ts                 # Queries/mutations usuarios
│   ├── products.ts              # CRUD productos/diagnósticos
│   ├── payments.ts              # Mutations pagos
│   ├── diagnostics.ts           # CRUD diagnósticos completados
│   └── http.ts                  # HTTP actions (webhook MP)
├── public/
│   └── assets/                  # Imágenes migradas del sitio actual
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Modelo de datos

### users
```typescript
{
  name: string,
  email: string,
  phone?: string,
  company?: string,
  role?: string,              // rol en su empresa
  industry?: string,
  authRole: "admin" | "client",
  avatarUrl?: string,
  createdAt: number
}
```

### products
```typescript
{
  name: string,               // "Perfil de Liderazgo Comercial"
  slug: string,               // "perfil-liderazgo-comercial"
  description: string,
  price: number,              // 0 = gratis, >0 = pagado
  currency: string,           // "COP"
  coverImage?: string,        // URL imagen de portada
  axes: [{
    name: string,             // "Estrategia"
    description?: string,
    factors: [{
      name: string,           // "Visión estratégica"
      description?: string,
      defaultWeight: number   // peso por defecto (1-100)
    }]
  }],
  webhookUrl?: string,        // URL webhook IA (opcional)
  status: "draft" | "published" | "archived",
  createdBy: Id<"users">,
  createdAt: number,
  updatedAt: number
}
```

### payments
```typescript
{
  userId: Id<"users">,
  productId: Id<"products">,
  amount: number,
  currency: string,
  status: "pending" | "approved" | "rejected",
  mpPaymentId?: string,
  mpPreferenceId?: string,
  paidAt?: number,
  createdAt: number
}
```

### diagnostics
```typescript
{
  userId: Id<"users">,
  productId: Id<"products">,
  paymentId?: Id<"payments">,   // null si producto gratis
  contactInfo: {
    name: string,
    email: string,
    phone?: string,
    company?: string,
    role?: string,
    industry?: string
  },
  context?: string,             // desafíos/contexto del cliente
  answers: [{
    axisIndex: number,
    factorIndex: number,
    weight: number,
    evaluation: number,         // 1-4
    impact: "alto" | "medio" | "bajo"
  }],
  scores: {
    axes: [{
      name: string,
      score: number,
      level: string             // "Fortaleza Mayor", etc.
    }],
    general: number
  },
  aiAnalysis?: {                // respuesta del webhook IA
    welcome?: string,
    axisAnalysis?: object[],
    gapAnalysis?: object,
    findings?: string[],
    executiveSummary?: string,
    actionPlan?: object
  },
  shareToken: string,           // token único para link público
  status: "in_progress" | "completed",
  completedAt?: number,
  createdAt: number
}
```

## Flujos principales

### Flujo cliente — producto de pago
1. Cliente navega a `/diagnosticos` (catálogo)
2. Selecciona un producto publicado
3. Se le pide login/registro si no está autenticado
4. Redirige a `/checkout/:productId` → crea preferencia en Mercado Pago
5. Cliente paga en MP → webhook IPN notifica a Convex → `payments.status = "approved"`
6. Cliente accede a `/diagnostico/:diagnosticId`
7. Completa formulario dinámico (ejes y factores del producto)
8. Submit: scoring local + POST a webhook IA (si configurado)
9. Resultados en `/resultado/:shareToken` — link permanente público
10. Descarga PDF

### Flujo cliente — producto gratis
1. Igual que arriba pero salta pasos 4-5
2. Se crea el diagnostic con `paymentId = null`

### Flujo admin — crear producto
1. Admin navega a `/admin/productos/nuevo`
2. Llena: nombre, descripción, precio, moneda
3. Define ejes (ej: "Estrategia", "Procesos")
4. Por cada eje, define factores con nombre y peso por defecto
5. Opcionalmente configura webhook IA
6. Guarda como "borrador"
7. Cuando está listo, cambia estado a "publicado" → aparece en catálogo

### Flujo admin — ver diagnósticos
1. Admin ve lista de clientes con filtros
2. Clic en cliente → ve sus diagnósticos
3. Clic en diagnóstico → ve resultados completos (misma vista que el cliente)

## Autenticación y autorización

- **Convex Auth** con providers: email/password + Google OAuth
- **Roles**: `admin` y `client`
- **Rutas protegidas**:
  - `/admin/*` → solo `authRole === "admin"`
  - `/cliente/*` → solo usuarios autenticados
  - `/resultado/:token` → público (acceso por shareToken, sin login)
  - Todas las demás → públicas
- **Seed admin**: el primer usuario admin se configura manualmente en Convex dashboard o por seed script

## Integración Mercado Pago

- **Checkout Pro**: crea una preferencia con el precio del producto
- **Webhook IPN**: Convex HTTP action recibe notificación de MP
- **Flujo**:
  1. Frontend llama mutation `createPayment(userId, productId)`
  2. Convex action `createMPPreference` llama a la API de MP
  3. Frontend redirige al `init_point` de MP
  4. Cliente paga → MP envía webhook a `https://[convex-url]/mercadopago/webhook`
  5. HTTP action verifica el pago con API de MP → actualiza `payments.status`
  6. Frontend reactivo detecta cambio → desbloquea diagnóstico

## Migración de páginas actuales

Las 13 páginas HTML se convierten en componentes React:
- Se extrae el contenido HTML al JSX
- Los estilos CSS actuales (variables --red, --ink, --smoke, --paper) se mapean a Tailwind config
- Las fuentes Jost/Inter se mantienen
- El JS actual (nav, WhatsApp widget) se convierte en componentes React
- Las imágenes en `assets/` se copian a `public/assets/`

## Brand system (mantenido)

```css
--red: #CC2D1A
--ink: #0B0B0B
--smoke: #F5F4F2
--paper: #FFFFFF
/* AI colors */
--sky: #38BDF8
--indigo: #4F46E5
/* Fonts */
--heading: 'Jost', sans-serif
--body: 'Inter', sans-serif
```

## Fases de implementación

| Fase | Contenido | Estimación |
|------|-----------|------------|
| 1 | Setup proyecto, instalar Node.js, scaffold React+Convex+Tailwind | 1 sesión |
| 2 | Modelo de datos Convex + auth + seed admin | 1 sesión |
| 3 | Migrar páginas públicas a React (Home, About, Services, Blog, etc.) | 2-3 sesiones |
| 4 | Constructor de productos en dashboard admin | 1-2 sesiones |
| 5 | Formulario dinámico de diagnóstico + scoring + resultados | 2-3 sesiones |
| 6 | Integración Mercado Pago | 1-2 sesiones |
| 7 | Portal cliente (historial, links compartibles) | 1 sesión |
| 8 | Dashboard admin completo (clientes, pagos, analytics) | 2-3 sesiones |
| 9 | PDF, análisis IA, pulido visual | 1-2 sesiones |

## Fuera de alcance (por ahora)

- App móvil nativa
- Notificaciones push
- Multi-idioma
- Diagnósticos colaborativos (múltiples evaluadores)
- Integración con CRM externo más allá del webhook actual
