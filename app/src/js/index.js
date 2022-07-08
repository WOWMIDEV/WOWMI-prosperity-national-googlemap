import L from 'leaflet';
import '../scss/styles.scss';

const API_KEY = 'pk.eyJ1IjoiZGlnaXRhbC1idXRsZXJzIiwiYSI6ImNsNThkanhqdzIxcjMzbm83em9laGRpenMifQ.MjADJmYkc6lP-PcaWDC6tQ';
const COORDS_CENTER_MAP = [39.8097343, -98.5556199];
const ZOOM = 4;

const elements = {
  companyLink: document.querySelector('[data-company="modal-link"]'),
  listOfCompaniesInfo: document.querySelectorAll('[data-company="data"]'),
  collectionList: document.querySelector('[data-collection="data"]'),
};

export const webflowRestart = () => {
  // eslint-disable-next-line no-unused-expressions
  window.Webflow && window.Webflow.destroy();
  // eslint-disable-next-line no-unused-expressions
  window.Webflow && window.Webflow.ready();
  // eslint-disable-next-line no-unused-expressions
  window.Webflow && window.Webflow.require('ix2').init();
  document.dispatchEvent(new Event('readystatechange'));
};

const geojsonFeature = [...elements.listOfCompaniesInfo].reduce((prev, curr) => {
  const nameEl = curr.querySelector('[data-company="name"]');
  const coordsEl = curr.querySelector('[data-company="coords"]');
  const imageLink = curr.querySelector('[data-company="image"]');
  const companyWebsite = curr.querySelector('[data-company="website"]');

  const data = {
    type: 'Feature',
    properties: {
      company: nameEl.textContent,
      companyWebsite: companyWebsite.textContent,
      popupContent: `
      <div data-modal="modal">
        <img class="map-modal-img" src='${imageLink.src}'/>
      </div>
      `,
    },
    geometry: {
      type: 'Point',
      coordinates: coordsEl.textContent.split(',').reverse(),
    },
  };
  // todo: add .reverse() for mapbox and remove for google map
  return [...prev, data];
}, []);

const map = L.map('map').setView(COORDS_CENTER_MAP, ZOOM);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY,
}).addTo(map);

const mark = L.icon({
  iconUrl: 'https://uploads-ssl.webflow.com/629f58fef317062068fa4ccc/62c59f6939c5fa924d1db44d_eva_pin-fill.svg',
  iconSize: [40, 50], // size of the icon
  iconAnchor: [20, 50], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
});

function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.popupContent);
  layer.on('mouseover', function () {
    this.openPopup();
  });
  layer.on('mouseout', function () {
    this.closePopup();
  });
}

const apdateModalLink = (link, element) => {
  const el = element;
  if (el.href) {
    el.href = link;
  }
};

const onClickMarker = (event) => {
  const { collectionList } = elements;
  const companyCards = collectionList.querySelectorAll('[data-company="name"]');
  const companyCardsParent = collectionList.querySelectorAll('.brokers-map__card');
  const companyFromGeoJson = event.target.feature.properties.company;

  const isActiveCard = [...companyCardsParent].find((card) => card.classList.contains('js--active'));

  if (isActiveCard) {
    isActiveCard.classList.remove('js--active');
  }

  const currentCard = [...companyCards].find((card) => {
    const companyNameFromCards = card.textContent;
    if (companyNameFromCards && companyFromGeoJson === companyNameFromCards) {
      return card;
    }
    return false;
  });

  const cardParent = currentCard.closest('.brokers-map__card');
  cardParent.classList.add('js--active');
  cardParent.scrollIntoView({ block: 'center', behavior: 'smooth' });

  apdateModalLink(event.target.feature.properties.companyWebsite, elements.companyLink);
};

L.geoJSON(geojsonFeature, {
  pointToLayer(feature, latlng) {
    return L.marker(latlng, { icon: mark }).on('click', onClickMarker);
  },
  onEachFeature,
}).addTo(map);

webflowRestart();
