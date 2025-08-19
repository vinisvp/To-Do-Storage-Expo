import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

//Interface, para que um objeto tenha esses exatos dados
interface Task {
  //Atributos que as tarefas vão ter
  //id da tarefa
  id: string;
  //texto da tarefa
  text: string;
  //se a tarefa está completa ou não
  done: boolean;
}

//Assinatura do componente
export default function App() {
  //Estado para guarda a tarefa que vai ser utilizada
  const [task, setTask] = useState('');
  //Estado para guarda as tarefas salvas e carregadas
  const [tasks, setTasks] = useState<Task[]>([]);
  
  //Sempre que a aplicação iniciar
  useEffect(() => {
    //Será carregada as tarefas
    loadTasks();
  }, []);

  //Sempre que o estado que carrega as tarefas for modificado
  useEffect(() => {
    //Essas tarefas serão salvas no armazenamento do celular
    saveTasks();
  }, [tasks]);

  //Função para adicionar uma tarefa no estado tasks
  const addTask = () => {
    //Se a terefa a ser adicionada for não for um texto vazio, então...
    if (task.trim()) {
      //mudar o valor do estado tasks
      //...tasks para colocar os valores anteriores na nova array
      // todo dentro das {...} é um novo objeto, que possuirá os atributos de uma tarefa
      setTasks([...tasks, { id: Date.now().toString(), text: task, done: false }]);
      //Esvaziar o texto da tarefa para ser adiocionada
      setTask('');
    }
  };

  //Mudar o estado de uma tarefa
  //vai receber um id
  const toggleTask = (id:any) => {
    //Muda o valor do estado tasks
    //map vai realizar uma função com cada item de tasks, e retornar uma nova array com os items modificados
    //se o id da tarefa presente em tasks for igual ao id recebido
      //então
        //retorne um objeto tarefa com os mesmos atributos (atraves do ...task)
        //mas com o done recebendo um valor inverso, ou seja, true vira false, e vise e versa
      //Se não, retorne a propria tarefa
    setTasks(tasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
  };

  //Salvar as tarefas no armazenamento do dispositivo
  //async pois usa await
  const saveTasks = async () => {
    //try para pegar as exceções (ou seja, os erros)
    try {
      //await para espera a função se concluida
      //se AsyncStorage.setItem() está salvando as tarefas em forma de JSON na memoria do dispositivo
      //com a chave @tasks
      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
    } catch (error) {
      //Caso dê erro, dá uma mensagem de erro
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  //Carregar as tarefas presentes no armazenamento do dispositivo
  const loadTasks = async () => {
    try {
      //AsyncStorage.getItem() pega as tarefas que são identificadas pela chave @tasks
      const storedTasks = await AsyncStorage.getItem('@tasks');
      //se possuir tarefas, então coloque o valor do estado tasks para as tarefas retornadas no armazenamento
      if (storedTasks) setTasks(JSON.parse(storedTasks));
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      {/**Input de texto */}
      <TextInput
        style={styles.input}
        //Texto que vai aparecer caso nada esteja digitado
        placeholder="Adicionar nova tarefa"
        //Valor que o Input vai modificar
        value={task}
        //Sempre que o texto mudar, o valor de task mudará junto
        onChangeText={setTask}
      />
      {/**Botão. onPress será o que vai ser execudo quando o botão for pressionad */}
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
      {/**FlatList para exibir as tarefas */}
      <FlatList
        //O array que o FlatList vai usar
        data={tasks}
        //Pegar a chave de cada tarefa, que será o id
        keyExtractor={(item) => item.id}
        //O componente que vai renderizar para cada item da array
        //item representa um item da array tasks, ou seja, uma tarefa
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTask(item.id)}>
              {/**Se a tarefa estiver marcada como feita, então vai usar o estilo taskDone também */}
              <Text style={[styles.taskText, item.done && styles.taskDone]}>
                {/**Texto da tarefa para exibir */}
                {item.text}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

//Definindo os estilos
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 5, marginBottom: 10 },
  addButton: { backgroundColor: '#ff00ffff', padding: 10, borderRadius: 5, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#fff', marginVertical: 5, borderRadius: 5 },
  taskText: { fontSize: 16 },
  taskDone: { textDecorationLine: 'line-through', color: 'gray' },
});
