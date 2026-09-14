export const SAMPLES = {
  github: {
    id: 1024883,
    login: 'octocat',
    name: 'The Octocat',
    company: '@github',
    blog: 'https://github.blog',
    location: 'San Francisco, CA',
    bio: 'GitHub mascot and developer advocate.',
    public_repos: 8,
    public_gists: 4,
    followers: 9420,
    following: 9,
    created_at: '2011-01-25T18:44:36Z',
    site_admin: false,
    hireable: null,
    plan: {
      name: 'enterprise_cloud',
      space: 976562499,
      collaborators: 0,
      private_repos: 9999,
    },
    repositories: [
      {
        id: 1296269,
        name: 'Hello-World',
        full_name: 'octocat/Hello-World',
        private: false,
        stars: 2840,
        forks: 2190,
        topics: ['octocat', 'git', 'sample'],
      },
      {
        id: 1826182,
        name: 'Spoon-Knife',
        full_name: 'octocat/Spoon-Knife',
        private: false,
        stars: 12450,
        forks: 139200,
        topics: ['forking', 'practice'],
      },
    ],
  },
  ecommerce: {
    order_id: 'ord_9281740912',
    currency: 'USD',
    subtotal: 189.5,
    tax: 15.16,
    total: 204.66,
    is_gift: false,
    customer: {
      id: 'cust_84920',
      email: 'alex.vance@example.com',
      tier: 'VIP',
      verified: true,
      tags: ['electronics', 'early_adopter'],
    },
    shipping_address: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postal_code: '97477',
      country: 'USA',
    },
    items: [
      {
        sku: 'DEV-MECH-KB-01',
        title: 'Wireless Mechanical Keyboard',
        qty: 1,
        unit_price: 149.0,
        switches: 'Gateron Brown',
        in_stock: true,
      },
      {
        sku: 'DEV-CBL-USB-03',
        title: 'Coiled Aviator Cable (Black)',
        qty: 1,
        unit_price: 40.5,
        in_stock: true,
      },
    ],
  },
  geojson: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749],
        },
        properties: {
          city: 'San Francisco',
          elevation_meters: 16,
          active_nodes: 42,
          monitored: true,
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-74.006, 40.7128],
        },
        properties: {
          city: 'New York City',
          elevation_meters: 10,
          active_nodes: 88,
          monitored: true,
        },
      },
    ],
  },
} as const

export type SampleKey = keyof typeof SAMPLES
