const carQuery = `
{
  id
  _instanceName
  manufacturer
  model
  regNumber
  purchaseDate
  manufactureDate
  wheelOnRight
  carType
  ecoRank
  maxPassengers
  price
  mileage
  garage {
    id
    _instanceName
  }
  technicalCertificate {
    id
    _instanceName
  }
  photo

  version
  createdBy
  createdDate
  lastModifiedBy
  lastModifiedDate
}
`;
// TODO add once Associations are supported:
// garage
// technicalCertificate

module.exports = {
  listQuery: carQuery,
  editQuery: carQuery
};