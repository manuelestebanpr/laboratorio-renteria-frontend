# Laboratorio Clínico Renteria - Frontend

Frontend de la aplicación de Laboratorio Clínico Renteria (LIMS)

## Tecnologías

- **Angular** (Latest LTS)
- **TypeScript** (Strict mode)
- **Angular Material** o **Tailwind CSS**
- **RxJS**

## Estado

🚧 **En desarrollo** - Frontend pendiente de implementación.

El backend ya está completo con el sistema de autenticación (US-001).

## Requisitos

- Node.js 20+
- npm 10+
- Angular CLI

## Estructura planificada

```
src/
├── app/
│   ├── auth/              # Login, password reset
│   ├── patient/           # Portal de pacientes
│   ├── admin/             # Portal de administración
│   └── shared/            # Componentes y servicios compartidos
├── assets/
└── environments/
```

## Historias de usuario pendientes

- US-002: Patient Portal - Login & Profile View
- US-003: Patient Portal - Results List & Download
- US-004: Patient Portal - Update Contact Info
- US-005: Admin Portal - Employee Management
- US-006: Admin Portal - Group Management
- US-007: Admin Portal - Patient Management
- US-008: Admin Portal - Results Management

## Backend API

URL: `http://localhost:8080/api/v1`

Documentación: Swagger UI en `/swagger-ui.html`

## Licencia

Proyecto privado - Laboratorio Clínico Renteria
