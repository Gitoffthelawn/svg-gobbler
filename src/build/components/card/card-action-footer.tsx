import React, { useState } from 'react'
import { Button, Grid, useColorModeValue, useToast } from '@chakra-ui/react'

import Drawer from '../drawer'
import FilenameModal from '../modals/filename-modal'
import ImageModal from '../modals/image-modal'
import handle from '../utils/actions'
import loc from '../utils/localization'

import CardActionMenu from './card-action-menu'

interface CardActionFooter {
  svgString: string
  height: number
  width: number
  whiteFill: boolean
}

const CardActionFooter = ({
  svgString,
  height,
  width,
  whiteFill,
}: CardActionFooter) => {
  const [showModal, setShowModal] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showOgModal, setShowOgModal] = useState(false)
  const [showOptimizedModal, setShowOptimizedModal] = useState(false)

  const toast = useToast({
    status: 'success',
    duration: 3000,
    isClosable: true,
  })

  return (
    <Grid
      position="absolute"
      templateColumns="3fr 2fr 1fr"
      gap={1}
      top="12px"
      bottom={0}
      left={0}
      right={0}
      bg={useColorModeValue('white', 'gray.700')}
    >
      <Button onClick={() => setShowOgModal(true)}>Download</Button>
      <Button
        onClick={() => {
          handle.copyToClipboard(svgString)
          toast({
            title: loc('card_copy_title'),
            description: loc('card_copy_desc'),
          })
        }}
      >
        {loc('card_copy_action')}
      </Button>

      <CardActionMenu
        setShowOptimizedModal={setShowOptimizedModal}
        setShowDrawer={setShowDrawer}
        svgString={svgString}
        setShowModal={setShowModal}
      />

      <FilenameModal
        title={loc('card_dl_orig')}
        download={handle.downloadOriginal}
        svgString={svgString}
        callback={setShowOgModal}
        showModal={showOgModal}
      />

      <FilenameModal
        title={loc('card_dl_opt')}
        download={handle.downloadOptimized}
        svgString={svgString}
        callback={setShowOptimizedModal}
        showModal={showOptimizedModal}
      />

      <Drawer
        svgString={svgString}
        callback={setShowDrawer}
        showDrawer={showDrawer}
      />

      <ImageModal
        callback={setShowModal}
        svgString={svgString}
        height={height}
        width={width}
        whiteFill={whiteFill}
        showModal={showModal}
      />
    </Grid>
  )
}

export default CardActionFooter