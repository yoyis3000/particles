import React from 'react';
import { render } from 'react-dom'; // eslint-disable-line
import axios from 'axios'; // eslint-disable-line
import MockAdapter from 'axios-mock-adapter'; // eslint-disable-line
import Tatari from '../src';
import sandboxStyles from './sandbox.scss';

const mockApi = new MockAdapter(axios);

mockApi
.onGet('/saved_filters')
  .reply(200, {})
.onGet('/available_filters')
  .reply(200, [
    {
      endpoint: '/filterA',
      key: 'mountain_dogs',
      value: 'Mountain Dogs'
    },
    {
      endpoint: '/filterB',
      key: 'scent_hounds',
      value: 'Scent Hounds'
    },
    {
      endpoint: '/filterC',
      key: 'guard_dogs',
      value: 'Guard Dogs'
    },
    {
      endpoint: '/filterD',
      key: 'poodles',
      value: 'Poodles'
    },
    {
      endpoint: '/filterE',
      key: 'retrievers',
      value: 'Retrievers'
    },
    {
      endpoint: '/filterF',
      key: 'herding_dogs',
      value: 'Herding Dogs'
    },
    {
      endpoint: '/filterG',
      key: 'spaniels',
      value: 'Spaniels'
    },
    {
      endpoint: '/filterH',
      key: 'flying_dogs',
      value: 'Flying Dogs'
    },
    {
      endpoint: '/filterI',
      key: 'mean_dogs',
      value: "Mean Dogs that use words like !@#$%^&*()~`.,/'[]{}|-_=+?>< "
    }
  ])
.onGet('/filterA')
  .reply(200, [
      { key: 2659261, value: 'Newfoundland' },
      { key: 1333393, value: 'Bernese Mountain Dog' },
      { key: 9617612, value: 'Greater Swiss Mountain Dog (Large)' },
      { key: 1670106, value: 'Saint Bernard' },
      { key: 6286295, value: 'Great Pyrennes' },
      { key: 8443652, value: 'Leonberger' },
      { key: 6767534, value: 'Chinook' },
      { key: 6310679, value: 'Kuvasz' },
      { key: 4429528, value: 'Tibetan Mastiff' }
  ])
.onGet('/filterB')
  .reply(200, [
      { key: 1384421, value: 'Harrier' },
      { key: 4107368, value: 'Basset Hound' },
      { key: 6328918, value: 'American English Coonhound (Large)' },
      { key: 6588341, value: 'Dachsund' },
      { key: 1000270, value: 'Ibizan Hound' },
      { key: 6279186, value: 'Portuguese Podengo Pequeno (Small)' },
      { key: 9674088, value: 'Bloodhound' },
      { key: 6646388, value: 'Otterhound' },
      { key: 8858134, value: 'Plott' },
      { key: 8159692, value: 'Treeing Walker Coonhound' },
      { key: 3558092, value: 'Redbone Coonhound' }
  ])
.onGet('/filterC')
  .reply(200, [
      { key: 7012631, value: 'Boxer' },
      { key: 7926295, value: 'Rottweiler' },
      { key: 1581248, value: 'Cane Corso' }
  ])
.onGet('/filterD')
  .reply(200, [
      { key: 7002311, value: 'Toy' },
      { key: 8291146, value: 'Miniature' },
      { key: 2176686, value: 'Standard' }
  ])
.onGet('/filterE')
  .reply(200, [
      { key: 8891492, value: 'Flat-Coated Retriever' },
      { key: 6321373, value: 'Curly-Coated Retriever' },
      { key: 5369769, value: 'Nova Scotia Duck Tolling Retreiver' },
      { key: 7191680, value: 'Chesapeake Bay Retriever' },
      { key: 5534015, value: 'Golden Retriever' },
      { key: 9173242, value: 'Labrador Retriever' }
  ])
.onGet('/filterF')
  .reply(200, [
      { key: 8474928, value: 'Shetland Sheepdog' },
      { key: 8990586, value: 'Border Collie' },
      { key: 4003196, value: 'Australian Cattle Dog' },
      { key: 9506467, value: 'Entlebucher Mountain Dog' },
      { key: 5941897, value: 'Canaan Dog' },
      { key: 1217177, value: 'Swedish Vallhund' },
      { key: 6236225, value: 'Bouvier des Flandres' },
      { key: 6292722, value: 'Australian Shepherd' },
      { key: 9731553, value: 'German Shepherd' },
      { key: 9234936, value: 'Schipperke' },
      { key: 8455793, value: 'Cardigan Welsh Corgi' },
      { key: 3891168, value: 'Pembroke Welsh Corgi' }
  ])
.onGet('/filterG')
  .reply(200, [
      { key: 1124459, value: 'Irish Water Spaniel' },
      { key: 5320652, value: 'Cocker Spaniel' },
      { key: 6798893, value: 'Welsh Springer Spaniel' },
      { key: 5951624, value: 'Sussex Spaniel' },
      { key: 6111852, value: 'English Toy Spaniel' },
      { key: 7642678, value: 'Field Spaniel' },
      { key: 2229001, value: 'English Cocker Spaniel' },
      { key: 8993388, value: 'Papillon' },
      { key: 9049941, value: 'Cavalier King Charles Spaniel' },
      { key: 1891910, value: 'Boykin Spaniel' },
      { key: 1086249, value: 'American Water Spaniel' }
  ])
.onGet('/filterH')
  .reply(200, [])
.onGet('/filterI')
  .reply(200, [
      { key: 5245908, value: 'Ben' }
  ])
.onPatch('/patch_filters')
  .reply(200);

const urls = {
  available: '/available_filters',
  patch: '/patch_filters',
  saved: '/saved_filters'
};

const onComplete = () => {
  console.warn("Called external population function.");  // eslint-disable-line
};

const filterOptions = options => options.filter(obj => obj.key !== 'assignee');

const stylesheets = [sandboxStyles];

render(
  <Tatari {...{ urls, onComplete, stylesheets, filterOptions }} />,
  document.getElementById('root')
);
