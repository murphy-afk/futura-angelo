// Structured data built from the settings table, never hardcoded in React.
// Session 4 validates these against the Rich Results test and extends them.

const DAY_ORDER = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];

const DAY_OF_WEEK = {
  lun: 'Monday',
  mar: 'Tuesday',
  mer: 'Wednesday',
  gio: 'Thursday',
  ven: 'Friday',
  sab: 'Saturday',
  dom: 'Sunday',
};

// Schema.org expects an ISO country code, the settings row holds the name.
const ADDRESS_COUNTRY_CODE = 'IT';

function address(settings) {
  if (!settings.address_street) return undefined;
  return {
    '@type': 'PostalAddress',
    streetAddress: settings.address_street,
    postalCode: settings.address_zip,
    addressLocality: settings.address_city,
    addressRegion: settings.address_region,
    addressCountry: ADDRESS_COUNTRY_CODE,
  };
}

function geo(settings) {
  const latitude = Number(settings.geo_lat);
  const longitude = Number(settings.geo_lng);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return undefined;
  return { '@type': 'GeoCoordinates', latitude, longitude };
}

function openingHoursSpecification(settings) {
  const hours = settings.hours;
  if (!hours || typeof hours !== 'object') return undefined;

  const specification = [];
  for (const day of DAY_ORDER) {
    const value = hours[day];
    if (typeof value !== 'string') continue;
    const [opens, closes] = value.split('-');
    if (!opens || !closes) continue;
    specification.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [DAY_OF_WEEK[day]],
      opens,
      closes,
    });
  }
  return specification.length > 0 ? specification : undefined;
}

function sameAs(settings) {
  return settings.facebook_url ? [settings.facebook_url] : undefined;
}

function rating(settings) {
  const ratingValue = Number(settings.google_rating_value);
  const reviewCount = Number(settings.google_rating_count);
  if (Number.isNaN(ratingValue) || Number.isNaN(reviewCount)) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

// Store on the home page: address, geo, telephone, hours and the rating
// taken from the Google listing.

export function localBusiness(settings, publicUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${publicUrl}/#negozio`,
    name: settings.shop_name || 'Futura',
    alternateName: settings.shop_legal_name || undefined,
    description: settings.tagline || undefined,
    url: `${publicUrl}/`,
    telephone: settings.phone_landline || undefined,
    email: settings.email || undefined,
    address: address(settings),
    geo: geo(settings),
    openingHoursSpecification: openingHoursSpecification(settings),
    aggregateRating: rating(settings),
    sameAs: sameAs(settings),
  };
}

// Organization on the Chi siamo page.

export function organization(settings, publicUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${publicUrl}/chi-siamo#organizzazione`,
    name: settings.shop_legal_name || settings.shop_name || 'Futura',
    alternateName: settings.shop_name || undefined,
    url: `${publicUrl}/`,
    email: settings.email || undefined,
    telephone: settings.phone_landline || undefined,
    address: address(settings),
    sameAs: sameAs(settings),
  };
}

// BreadcrumbList for inner pages. The last item carries no URL, it is the
// page the visitor is on.

export function breadcrumbList(items, publicUrl) {
  const elements = items.map((item, index) => {
    const element = {
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
    };
    if (index < items.length - 1) element.item = `${publicUrl}${item.path}`;
    return element;
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: elements,
  };
}
