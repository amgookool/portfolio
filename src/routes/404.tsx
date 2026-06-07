import { createFileRoute } from '@tanstack/react-router'
import NotFound from '#/components/NotFound'

// Real route so the page prerenders to a static 404.html (a not-found response
// returns HTTP 404 and can't be prerendered). Firebase Hosting serves this
// file for unmatched paths; the root notFoundComponent reuses the same UI for
// client-side navigation.
export const Route = createFileRoute('/404')({
  component: NotFound,
})
