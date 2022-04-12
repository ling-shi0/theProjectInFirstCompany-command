import Vue from 'vue'
import Filters from './filter.js'

Object.keys(Filters).forEach((filter) => Vue.filter(filter, Filters[filter]))
