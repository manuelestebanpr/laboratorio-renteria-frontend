# Laboratorio Clínico Renteria - Frontend

Frontend de la aplicación de Laboratorio Clínico Renteria (LIMS)

## 🚀 Tecnologías

- **Angular 19** (Latest LTS, Standalone Components)
- **TypeScript** (Strict mode)
- **Tailwind CSS 4** (Diseño accesible para adultos mayores)
- **Transloco** (i18n - Español/English)
- **Jest** (Testing)
- **RxJS** (Reactive programming)

## 📋 Requisitos

- Node.js 20+
- npm 10+
- Angular CLI 19+

## 🛠️ Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar proxy

El archivo `proxy.conf.json` ya está configurado para apuntar al backend en `localhost:8080`.

### 3. Ejecutar en desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### 4. Build para producción

```bash
npm run build:prod
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios singleton, guards, interceptores
│   │   ├── auth/               # Auth service, interceptor, guards
│   │   ├── i18n/               # Transloco loader
│   │   ├── api/                # API service base
│   │   └── layout/             # Layout components (header, patient, admin)
│   ├── shared/                  # Componentes reutilizables
│   │   └── components/         # Button, Input, Card, Alert, etc.
│   ├── features/                # Feature modules
│   │   ├── auth/               # Login, password reset
│   │   ├── patient/            # Patient portal
│   │   └── admin/              # Admin portal
│   └── models/                  # TypeScript interfaces
├── assets/
│   └── i18n/                   # Archivos de traducción
├── environments/                # Configuraciones por ambiente
└── styles/                      # Estilos globales con Tailwind
```

## 🌍 Internacionalización (i18n)

El proyecto usa **Transloco** para soporte multi-idioma:

- **Español** (default): `src/assets/i18n/es.json`
- **English**: `src/assets/i18n/en.json`

El usuario puede cambiar el idioma desde el header.

## ♿ Accesibilidad

Diseñado específicamente para adultos mayores:

- ✅ Tamaño de fuente mínimo 16px
- ✅ Contraste alto (WCAG AA)
- ✅ Botones grandes (mínimo 44px)
- ✅ Navegación por teclado
- ✅ ARIA labels
- ✅ Soporte para screen readers

## 🔐 Autenticación

- JWT tokens (access + refresh)
- Refresh token en cookie HttpOnly
- Guards para rutas protegidas
- Permission-based rendering

## 📱 Responsive Design

- Mobile-first approach
- Layouts optimizados para:
  - Móviles (single column)
  - Tablets
  - Desktop

## 🎯 Características Implementadas

### FE-001: Angular Project Scaffold ✅

- [x] Angular 19 con standalone components
- [x] Tailwind CSS con tema accesible
- [x] Transloco para i18n
- [x] Estructura de carpetas según arquitectura
- [x] Auth service con JWT
- [x] HTTP interceptor para tokens
- [x] Auth guards
- [x] Componentes compartidos (Button, Input, Card, Alert, etc.)
- [x] Layout components (Header, PatientLayout, AdminLayout)
- [x] Rutas con lazy loading
- [x] Configuración Jest para testing

### Próximas Historias

- FE-002: Authentication UI (completo con login funcional)
- FE-003: Patient Portal - Layout & Profile
- FE-004: Patient Portal - Results View & Download
- FE-005: Patient Portal - Contact Update & Password Change
- FE-006: Admin Portal - Layout & Dashboard

## 🔗 Backend API

URL Base: `http://localhost:8080/api/v1`

Endpoints disponibles:
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout
- `POST /auth/password` - Change password
- `POST /auth/password-reset/request` - Request password reset
- `POST /auth/password-reset/confirm` - Confirm password reset

## 📝 Notas

- El proyecto sigue la arquitectura definida por Son of Anton
- Código en inglés, UI en español/english
- Commits en inglés descriptivo
- Usamos signals para state management (sin NgRx por ahora)

## 👥 Equipo

- **Product Owner**: Master
- **Project Manager**: Kevin
- **System Architect**: Son of Anton
- **Senior Developer**: Grandson of Anton

## Licencia

Proyecto privado - Laboratorio Clínico Renteria
