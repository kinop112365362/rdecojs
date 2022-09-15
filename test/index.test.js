/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom/extend-expect'
import { imc, create } from '@rdecojs/core'

test('imc and create api', async () => {
  create('helloWorld', () => ({
    setup() {
      console.debug('hello world')
    },
  }))
  imc('helloWorld').setup()
})
