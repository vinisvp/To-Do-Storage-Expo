import { Stack } from "expo-router";

//Layout da tela que será exibido na aplicação
export default function RootLayout() {
  //Navagação em Stack
  //Ele acumula as telas e permite voltar para a tela anterior
  //Por padrão, ele sempre vai e tem que pegar o index.tsx
  return <Stack />;
}
