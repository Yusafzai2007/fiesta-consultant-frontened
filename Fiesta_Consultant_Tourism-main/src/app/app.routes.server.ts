import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // ✅ Static pages: Prerender for speed
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'sinup', renderMode: RenderMode.Prerender },
  { path: 'aboutus', renderMode: RenderMode.Prerender },
  { path: 'citytour', renderMode: RenderMode.Prerender },
  { path: 'corporate', renderMode: RenderMode.Prerender },
  { path: 'local', renderMode: RenderMode.Prerender },
  { path: 'Product_details', renderMode: RenderMode.Prerender },
  { path: 'producttable', renderMode: RenderMode.Prerender },
  { path: 'card', renderMode: RenderMode.Prerender },
  { path: 'city', renderMode: RenderMode.Prerender },

  // ❌ Dynamic routes: Use server mode
  { path: 'products/:id', renderMode: RenderMode.Server },
  { path: 'admin/edit/:id', renderMode: RenderMode.Server },
  { path: 'admin/user-details/:userId', renderMode: RenderMode.Server },
  { path: 'admin/user-Order-details/:userId', renderMode: RenderMode.Server },
  { path: 'admin/carddetails/:userId', renderMode: RenderMode.Server },

  // ✅ Admin static routes (can prerender or server as needed)
  { path: 'admin', renderMode: RenderMode.Server },
  { path: 'admin/Users', renderMode: RenderMode.Server },
  { path: 'admin/Orders', renderMode: RenderMode.Server },
  { path: 'admin/Add-Products', renderMode: RenderMode.Server },
  { path: 'admin/products', renderMode: RenderMode.Server },

  // ✅ Wildcard fallback
  { path: '**', renderMode: RenderMode.Server }
];
