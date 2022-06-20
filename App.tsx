import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Keyboard,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  TextInputEndEditingEventData,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default function App() {
  const [goals, setGoals] = useState<string[]>([]);
  const [enteredGoal, setEnteredGoal] = useState<string>('');
  const [hideCursor, setHideCursor] = useState(true);
  const goalInputRef = useRef<TextInput>(null);

  function handleInputGoalChange(
    e: NativeSyntheticEvent<TextInputChangeEventData>,
  ): void {
    const goal: string = e.nativeEvent.text;
    setEnteredGoal(goal);
    setHideCursor(false);
  }

  function handleAddGoal() {
    setGoals([...goals, enteredGoal]);
    handleResetGoal();
  }

  function handleResetGoal() {
    setEnteredGoal('');
  }

  function handleUpdateItems(
    e: NativeSyntheticEvent<TextInputEndEditingEventData>,
    inputIndex: number,
  ) {
    const newGoal = e.nativeEvent.text;
    const newGoals = goals.map((goal, index) => {
      return index === inputIndex ? newGoal : goal;
    });
    setGoals(newGoals as string[]);
  }

  function handleDeleteItem(inputIndex: number) {
    let newGoals: string[] = [];
    if (!goals.length) {
      return;
    }
    if (goals.length === 1) {
      newGoals = [];
    } else {
      newGoals = goals.filter((goal, index) => index !== inputIndex);
    }
    setGoals(newGoals as string[]);
  }

  function handleClickOutside(e: GestureResponderEvent) {
    const { current } = goalInputRef;
    function clickOutsideHandler() {
      const target: unknown = e.target;
      if (current && current !== target) {
        setHideCursor(true);
        Keyboard.dismiss();
      }
    }
    clickOutsideHandler();
  }

  function handleShowCursor() {
    setHideCursor(false);
  }

  return (
    <TouchableWithoutFeedback
      onPress={(event: GestureResponderEvent) => handleClickOutside(event)}>
      <View style={styles.appContainer}>
        <View style={styles.innerContainer}>
          <TextInput
            ref={goalInputRef}
            style={styles.textInput}
            caretHidden={hideCursor}
            onTouchEnd={handleShowCursor}
            onChange={handleInputGoalChange}
            onSubmitEditing={() => {
              handleAddGoal();
              Keyboard.dismiss;
            }}
            value={enteredGoal}
          />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onTouchStart={handleAddGoal}>
              <Text>Add</Text>
            </Pressable>
            <Pressable style={styles.button} onTouchEnd={handleResetGoal}>
              <Text>Reset</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.itemsContainer}>
          <Text style={styles.title}>Item List</Text>
          {goals.map((goal: string, index: number) => (
            <View key={index} style={styles.rowItem}>
              <TextInput
                style={styles.item}
                onSubmitEditing={event => handleUpdateItems(event, index)}>
                {goal}
              </TextInput>
              <Pressable
                style={styles.interactiveIcon}
                onPress={() => handleDeleteItem(index)}>
                <Icon name="delete-outline" size={20} />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    width: '100%',
    flex: 1,
    padding: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'scroll',
    backgroundColor: '#E9E9E9',
  },
  innerContainer: {
    width: '80%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 50,
    borderBottomWidth: 3,
    borderColor: '#cccccc',
    marginBottom: 25,
  },
  textInput: {
    borderWidth: 5,
    borderColor: '#cccccc',
    borderRadius: 10,
    width: '100%',
    height: 50,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    width: '30%',
    height: 30,
    borderWidth: 5,
    borderRadius: 10,
    borderColor: '#cccccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    marginTop: 20,
    marginBottom: 25,
  },
  itemsContainer: {
    width: '100%',
    flex: 9,
    alignItems: 'center',
    borderWidth: 5,
    borderRadius: 15,
    borderColor: '#FECE45',
  },
  rowItem: {
    maxWidth: '95%',
    height: 45,
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    flex: 9,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  interactiveIcon: {
    flex: 1,
  },
});
