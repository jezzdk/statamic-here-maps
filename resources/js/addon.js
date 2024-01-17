import Fieldtype from './components/HereMapsFieldtype.vue';

Statamic.booting(() => {
    Statamic.$components.register('here_maps-fieldtype', Fieldtype);
});
