import React from 'react'
import {
  Button,
  Center,
  Box,
  useColorModeValue,
  Text,
  Flex,
  useToken,
} from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import { AppData } from '../../types'
import { util } from '../utils/upload'

interface EmptyGallery {
  headline: string
  description: string
  setData: React.Dispatch<React.SetStateAction<AppData>>
}

const EmptyGallery = ({ headline, description, setData }: EmptyGallery) => {
  const backgroundColor = useColorModeValue('gray.100', 'gray.800')
  const lightThemeOutline = useToken('colors', ['gray.400'])
  const darkThemeOutline = useToken('colors', ['gray.500'])
  const outlineColor = useColorModeValue(lightThemeOutline, darkThemeOutline)

  return (
    <Box p="8" bg={backgroundColor}>
      <Center
        id="dropzone"
        maxW="7xl"
        minH="400px"
        mx="auto"
        outline={`2px dashed ${outlineColor}`}
        borderRadius="24px"
        onDragOver={util.handleDragOver}
        onDragLeave={util.handleDragOut}
        onDrop={(event) => {
          util
            .handleDrop(event)
            .then((result) => {
              if (result.length > 0) setData([result])
            })
            .catch(() => {})
        }}
      >
        <Box>
          <Flex
            direction="column"
            align="center"
            justify="center"
            h="full"
            textAlign="center"
            mt="-10"
          >
            <Box>
              <Text
                maxW="lg"
                mx="auto"
                fontWeight="extrabold"
                fontSize={{ base: '3xl', lg: '4xl' }}
                letterSpacing="tight"
                lineHeight="normal"
              >
                {headline}
              </Text>
              <Text mt="5" mb="6" maxW="sm" mx="auto">
                {description}
              </Text>
              <Button
                variant="solid"
                colorScheme="red"
                leftIcon={<FaPlus />}
                onClick={util.handleUploadClick}
              >
                Upload SVG
              </Button>
            </Box>
          </Flex>
        </Box>
      </Center>
    </Box>
  )
}

export default EmptyGallery