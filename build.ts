// build.ts

import { exec } from 'child_process';

// Execute o Vite para construir os arquivos JS
exec('vite build', (err, stdout, stderr) => {
  if (err) {
    console.error(`Erro durante a construção do Vite: ${err}`);
    return;
  }

  console.log('Construção do Vite concluída com sucesso!');

  // Em seguida, execute o Terser para minificar os arquivos JS
  exec('terser -c -m -o dist/app.min.js -- dist/*.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro durante a ofuscação: ${err}`);
      return;
    }
    console.log('Código ofuscado com sucesso!');
  });
});
