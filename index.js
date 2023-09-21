import express from 'express';
import {retornaColecaoHistoricoInflacao, buscaAnoHistoricoInflacao, buscaIdHistoricoInflacao,calcularReajuste,validacaoErro} from './servico.js';

const app = express();

app.get('/historicoIPCA/calculo', (req, res) => {

    const valor = parseFloat(req.query.valor);
    const dataInicialMes = parseInt(req.query.mesInicial);
    const dataInicialAno = parseInt(req.query.anoInicial);
    const dataFinalMes = parseInt(req.query.mesFinal);
    const dataFinalAno = parseInt(req.query.anoFinal); 

    if (validacaoErro(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno)) {
        res.status(400).json({ erro: 'Parâmetros inválidos' });
        return;
      }
    
      const resultado = calcularReajuste(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno);
      res.json({ resultado: resultado });
});


app.get('/historicoIPCA/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if(isNaN(id)){
        res.status(404).json({ erro: 'ID inválido' });
        return;
    };

    const idResultado = buscaIdHistoricoInflacao(id);
    if(idResultado){
        res.json(idResultado);
    }else{
        res.status(404).json({erro:'Id nao encontrado'})
    };
});


app.get('/historicoIPCA', (req, res) => {
    const ano = parseInt(req.query.ano);
    if(isNaN(ano)){
        res.status(404).json({erro: 'valor passado invalido'});
    }else{
        const filtraAno = buscaAnoHistoricoInflacao(ano);
        if (filtraAno.length > 0) {
            res.json(filtraAno);
          } else {
            res.status(404).json({ erro: "Nenhuma Ano foi encontrado" });
          };
    }
});

app.listen(8080, () => {
    console.log('Api de IPA inicializando..');
});
