# Ejercicio TCP: Aplicación de Notas

## Descripción general

Construye una aplicación colaborativa para tomar notas usando Next.js y Supabase. Este ejercicio está diseñado para evaluar tus habilidades de desarrollo full-stack, pensamiento de producto y capacidad para construir aplicaciones seguras multi-tenant.

**Compromiso de tiempo esperado**: 4-6 horas

## Requisitos principales

### 0. Requisitos técnicos

- Docker
- Node.js
- Supabase CLI (https://supabase.com/docs/guides/local-development)

### 1. Autenticación

Implementa autenticación de usuarios usando Supabase Auth. Los usuarios deben poder:

- Registrarse para una nueva cuenta
- Iniciar sesión en una cuenta existente
- Cerrar sesión

### 2. Workspaces

Los usuarios pueden crear y gestionar workspaces:

- Crear nuevos workspaces
- Ver sus workspaces
- Acceder a detalles del workspace

### 3. Miembros del equipo

Habilita colaboración dentro de los workspaces:

- Invitar miembros del equipo a workspaces
- Ver miembros del equipo en un workspace
- Gestionar membresía del equipo

### 4. Notas

Crea un sistema para tomar notas con capacidad de compartir con el equipo:

- Crear, leer, actualizar y eliminar notas
- Compartir notas con miembros del equipo del workspace
- Ver notas compartidas por miembros del equipo
- Organización básica de notas

## Requisitos técnicos

### Requeridos

- **Next.js**
- **Supabase** - Para autenticación y base de datos
  - Usa Supabase CLI para desarrollo local (no se necesita cuenta/proyecto de Supabase)
  - La autenticación debe usar Supabase Auth, por simplicidad
  - El acceso a la base de datos puede usar el cliente Supabase, SQL directo, o una combinación
  - Incluye tus archivos de migración en el repositorio

### Recomendados (pero no requeridos)

- TypeScript
- Tailwind CSS
- shadcn/ui u otra librería de componentes
- Manejo adecuado de errores y estados de carga

## Consideraciones de arquitectura

### Seguridad de la base de datos

Tienes flexibilidad en cómo aseguras el acceso a datos:

- **Políticas RLS de Supabase** - Aprovecha Row Level Security para autorización a nivel de base de datos
- **Seguridad a nivel de aplicación** - Implementa autorización en tus rutas de API/componentes del servidor
- **Enfoque híbrido** - Combina ambas estrategias
- **Acceso directo a la base de datos** - Usa Postgres directamente si lo prefieres

Considera las ventajas y desventajas de tu enfoque y prepárate para discutirlas.

### Modelo de datos

Diseña tu esquema de base de datos para soportar:

- Cuentas de usuario
- Workspaces (multi-tenancy)
- Membresía de equipo y permisos
- Notas y relaciones de compartición

El diseño específico del esquema depende de ti.

## Requisitos de entrega

Por favor entrega lo siguiente:

### 1. Repositorio de GitHub

- Comparte un enlace a tu repositorio (público o otorga acceso a @gonzalonunez)
- Incluye un historial de commits claro
- Asegura que el repositorio incluya todos los archivos necesarios e instrucciones de configuración claras
- **Incluye tus migraciones de Supabase** en el directorio `supabase/migrations`

### 2. Video demostrativo (5-10 minutos)

Graba un video breve que:

- Demuestre la aplicación funcionando
- Muestre las características clave en acción
- Explique cualquier decisión técnica notable

### 3. Documentación escrita

Incluye un archivo `SUBMISSION.md` que cubra:

- **Instrucciones de configuración** - Cómo ejecutar tu aplicación localmente
- **Decisiones de arquitectura** - Elecciones técnicas clave y ventajas/desventajas
- **Enfoque de seguridad** - Cómo implementaste la autorización
- **Desglose de tiempo** - Aproximadamente cómo pasaste las 4-6 horas
- **Limitaciones conocidas** - Qué mejorarías con más tiempo

## Criterios de evaluación

Tu entrega será evaluada en:

### Calidad del código

- Código limpio, legible y bien organizado
- Abstracciones apropiadas y reutilización de código
- Estilo y convenciones consistentes
- Manejo adecuado de errores

### Pensamiento de producto

- Experiencia de usuario intuitiva
- Implementación reflexiva de características
- Manejo de casos extremos
- Atención al detalle

### Profundidad técnica

- Decisiones arquitectónicas sólidas
- Implementación de seguridad adecuada
- Diseño de base de datos y consultas
- Comprensión de las capacidades de Next.js y Supabase

### Comunicación

- Documentación clara
- Presentación de video efectiva
- Razonamiento detrás de las decisiones
- Identificación de ventajas y desventajas

## Yendo más allá

Aunque los requisitos principales deberían ser alcanzables en 4-6 horas, siéntete libre de agregar características adicionales o mejoras que muestren tus habilidades. Algunas ideas:

- Edición de texto enriquecido
- Colaboración en tiempo real
- Categorías o etiquetas de notas
- Funcionalidad de búsqueda
- Feeds de actividad
- Permisos y roles
- Responsividad móvil
- Pruebas (testing)

**Estamos interesados en ver qué priorizas y cómo abordas la extensión de los requisitos básicos.**

## ¿Preguntas?

Si tienes preguntas aclaratorias sobre los requisitos, por favor contacta a gbn@tcpamericas.com. Queremos que tengas éxito y estaremos felices de proporcionar orientación sobre aspectos ambiguos del ejercicio.

¡Buena suerte, y esperamos ver lo que construyes!
