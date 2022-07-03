import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { HStack, VStack } from 'react-stacked'

import Button from '../component/atom/Button'
import { TextField } from '../component/atom/TextField'
import yup, { yupResolver } from '../lib/validation'
import useTheme from '../util/useTheme'

interface Player {
  name: string
  time: number
}
interface SchemaInput {
  players: Player[]
}

const schema = yup.object().shape<SchemaInput>({
  players: yup.array().of(
    yup.object().shape<Player>({
      name: yup.string().required(),
      time: yup.number().required()
    }).required()
  ).required()
})

const Landing: React.FC = () => {
  const { theme } = useTheme()

  const form = useForm<SchemaInput>({
    criteriaMode: 'all',
    defaultValues: { players: [{ name: '', time: 0 }]},
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'players'
  });

  const handleAddPlayer = (): void => {
    const players = form.getValues().players
    const defaultTime = players?.[players.length - 1].time ?? 0
    fieldArray.append({ name: '', time: defaultTime })
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1, flexBasis: 0, width: '100%' }}>
      <View style={[styles.container, { backgroundColor: theme.background.main }]}>

      {fieldArray.fields.map((field, index) => {
        return (
          <HStack alignItems='center' key={field.id} maxWidth={300}>
            <VStack grow={1}>
              <TextField
                form={form}
                name={`players.${index}.name`}
                title='Name'
              />
            </VStack>

            <VStack>
              <TextField
                form={form}
                name={`players.${index}.time`}
                title='Time (s)'
              />
            </VStack>
          </HStack>
        )
      })}

           <Button
          backgroundColor={theme.primary.main}
          onPress={handleAddPlayer}
          textColor={theme.primary.text.primary}
          title='Add new player'
        />

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Landing
