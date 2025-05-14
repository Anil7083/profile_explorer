// Coordinates object shape
export const Coordinates = {
  lat: 0, // example latitude
  lng: 0, // example longitude
};

// Address object shape
export const Address = {
  street: '', // example street
  city: '', // example city
  state: '', // example state
  zipCode: '', // example zip code
  country: '', // example country
  coordinates: Coordinates,
};

// Profile object shape
export const Profile = {
  id: '', // example id
  name: '', // example name
  avatar: '', // example avatar URL
  description: '', // example description
  email: '', // example email
  phone: '', // example phone number (optional)
  address: Address,
};
