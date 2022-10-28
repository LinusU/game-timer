import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Spacer from 'react-spacer'
import { HStack, VStack } from 'react-stacked'
import WithSeparator from 'react-with-separator'

import Button from '../component/atom/Button'
import FormTextInput from '../component/molecule/FormTextInput'
import yup, { yupResolver } from '../lib/validation'
import useKeyboardBottomInsets from '../util/useKeyboardBottomInsets'
import useNavigation from '../util/useNavigation'
import usePlayers from '../util/usePlayers'
import useTheme from '../util/useTheme'

export interface Player {
  name: string
  time: string
}
interface SchemaInput {
  players: Player[]
}

const schema = yup.object().shape<SchemaInput>({
  players: yup.array().of(
    yup.object().shape<Player>({
      name: yup.string().required(),
      time: yup.string().matches(/^\d+$/, 'The field should have digits only').required()
    }).required()
  ).required()
})

const Landing: React.FC = () => {
  const [navigation] = useNavigation<'Landing'>()
  const { theme } = useTheme()
  const { updatePlayers } = usePlayers()
  const insets = useSafeAreaInsets()
  const keyboardBottomInsets = useKeyboardBottomInsets()

  const form = useForm<SchemaInput>({
    criteriaMode: 'all',
    defaultValues: { players: [{ name: '', time: '10' }] },
    mode: 'onTouched',
    resolver: yupResolver(schema)
  })

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'players'
  })

  const handleAddPlayer = (): void => {
    const players = form.getValues().players
    const defaultTime = players?.[players.length - 1]?.time ?? '10'
    fieldArray.append({ name: '', time: defaultTime })
  }

  const handleStartTimer = (input: SchemaInput): void => {
    updatePlayers(input.players)
    navigation.navigate('Timer', {})
  }

  return (
    <VStack alignItems='center' backgroundColor={theme.background.main} grow={1}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1, flexBasis: 0, width: '100%' }}>
        <View style={styles.container}>
          <Spacer height={0} grow={1} />

          <WithSeparator separator={<Spacer height={16} />} trailing>
            {fieldArray.fields.map((field, index) => {
              return (
                <HStack alignItems='center' key={field.id} maxWidth={400}>
                  <VStack grow={1}>
                    <FormTextInput
                      form={form}
                      name={`players.${index}.name`}
                      title='Name'
                      type='default'
                    />
                  </VStack>

                  <VStack>
                    <FormTextInput
                      form={form}
                      name={`players.${index}.time`}
                      title='Time (s)'
                      type='digits'
                    />
                  </VStack>

                  <Button
                    backgroundColor='#fff'
                    onPress={() => fieldArray.remove(index)}
                    textColor='#000'
                    title='delete'
                  />
                </HStack>
              )
            })}
          </WithSeparator>

          <Button
            backgroundColor={theme.primary.light}
            onPress={handleAddPlayer}
            textColor={theme.primary.text.primary}
            title='Add new player'
          />

          <Spacer height={16} grow={1} />
        </View>
      </ScrollView>

      <Spacer height={keyboardBottomInsets} />

      <Button
        backgroundColor={theme.primary.main}
        onPress={form.handleSubmit(handleStartTimer)}
        textColor={theme.primary.text.primary}
        title='Start timer'
      />

      <Spacer height={insets.bottom} />
    </VStack>
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
