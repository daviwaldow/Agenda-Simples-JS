// Esta funcao formata um objeto Date para string dia da semana, dia, mes, ano e horario.
function formataDataHoraStr(dataHora) {
    dayName = new Array("Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado");
    monName = new Array("janeiro", "fevereiro", "março", "abril", "maio", "junho", "agosto", "outubro", "novembro", "dezembro");
    h=dataHora.getHours();
    m=dataHora.getMinutes();
    s=dataHora.getSeconds();
    let meuResultadodasHoras = dayName[dataHora.getDay() ] + ", " + dataHora.getDate() + " de " + monName[dataHora.getMonth() ] + " de " + dataHora.getFullYear() +" - "+ h+":"+m+":"+s;
    return meuResultadodasHoras;
}

// Esta funcao chama a funcao alterarHoraCamposTela a cada meio milisegundo
setInterval(() => {
    let timeNow = new Date();
    alterarHoraCamposTela(formataDataHoraStr(timeNow));
},500);

// Esta funcao atualiza o campo de dia da semana, dia, mes, ano e horario.
function alterarHoraCamposTela(textoDiaHoraAtual) {
    document.getElementById('dataHora').innerHTML= textoDiaHoraAtual;
}

// Esta funcao vai receber a lista de contatos e adicionar na tela do usuario.
function exibirLista(parmFonteDados){
    let tabelaContatos = document.getElementById('tabelaContatos');
    
    deletaTabela(tabelaContatos);

    for (let volta = 0; volta < parmFonteDados.length; volta++){
        let linhaTabela = tabelaContatos.insertRow();
        let colunaTabela = linhaTabela.insertCell(0);
        let novoNodeTexto = document.createTextNode(parmFonteDados[volta].nome);
        colunaTabela.appendChild(novoNodeTexto);
        colunaTabela = linhaTabela.insertCell(1);
        novoNodeTexto = document.createTextNode(parmFonteDados[volta].telefone);
        colunaTabela.appendChild(novoNodeTexto);
        
        let botaoDeletar = document.createElement("button");
        botaoDeletar.addEventListener("click", ()=>{deletarContato(parmFonteDados[volta].telefone);},false);
        botaoDeletar.appendChild(document.createTextNode("Deletar"));
        botaoDeletar.classList.add("btnPrimary");
        colunaTabela = linhaTabela.insertCell(2);
        colunaTabela.appendChild(botaoDeletar);
    }
}

function deletarContato(telefone){
    let indice = fonteDados.filter(x => x.telefone != telefone);
    localStorage.removeItem("listaContatos"); 
    localStorage.setItem("listaContatos", JSON.stringify(indice));
    exibirLista(indice);
    fonteDados = indice;

}
// Esta funcao vai validar o contato que o usuario adicionar
function validarContato(){
    let campoNome = document.getElementById('fname');
    let campoTelefone = document.getElementById('telefone');
    let erro = false;
    let telefoneFormatado = "";
    if ((campoNome.value == "") && (campoTelefone.value == "")){
        erro = true;
        atualizarMensagem("Por Favor, informe os campos obrigatórios!");
        return [1];
    }  else {
            let resultadoValidaTel = validaTel(campoTelefone.value);
            switch (resultadoValidaTel[0]) {
                case 1:
                    erro = true;
                    atualizarMensagem("Telefone Inválido! Informe um telefone válido.");
                    return [1];
                case 2:
                    erro = true;
                    atualizarMensagem("Telefone fixo sem DDD.");
                    return [1];
                case 3:
                    erro = true;
                    atualizarMensagem("Telefone celular sem DDD.");
                    return [1];
                default:
                    telefoneFormatado = resultadoValidaTel[1];
                    break;
            }
            let resultadoValidaNome = validaNome(campoNome.value);
            switch (resultadoValidaNome) {
                case 1:
                    erro = true;
                    atualizarMensagem("Informe um nome com pelo menos 4 caracteres.");
                    return [1];
                case 2:
                    erro = true;
                    atualizarMensagem("Nome não pode começar com um número.");
                    return [1];
                case 3:
                    erro = true;
                    atualizarMensagem("Nome não pode conter apenas números.");
                    return [1];
                case 4:
                    erro = true;
                    atualizarMensagem("Nome não pode conter estes caracters: ) ( ! = + ~ ] [ } { / * \\");
                    return [1];
                default:
                    break;
            }
    }
    let testeTellIgual = existeContatoNaBase(fonteDados,telefoneFormatado)
    if (testeTellIgual) {
        erro = true;
        atualizarMensagem("Telefone ja foi adicionado!");
        return [1];
    }
    if (erro == false) {
        atualizarMensagem("");
    }
    return [0,telefoneFormatado,campoNome.value];
}

function adicionarContato(){
let retornoDaValidação = validarContato();
let campoNome = retornoDaValidação[2];
let telefoneFormatado = retornoDaValidação[1];
    if (retornoDaValidação[0] == 0){
        fonteDados.push({nome: campoNome , telefone: telefoneFormatado });
        localStorage['listaContatos'] = JSON.stringify(fonteDados);
        atualizarMensagem("Contato " + campoNome + " adicionado!");
        exibirLista(fonteDados);
    } else {
        atualizarMensagem("Contato Não Foi Adicionado");
    }
}
// Esta funçao recebe um telefone e retorna true ou false se o telefone ja existe na base de dados
function existeContatoNaBase(parFonteDeDados,telParaProcurar){
    for (let i = 0; i < parFonteDeDados.length; i++) {
        if (telParaProcurar == parFonteDeDados[i].telefone) {
        return true
        break;
        }
    }
    return false
}
// Esta funcao vai receber um texto e apresentar este texto na tela do usuario como mensagem.
function atualizarMensagem(mensagemTxt){
    document.getElementById('mensagemAviso').innerHTML= mensagemTxt;
}

// Esta funcao deleta as linhas da tabela.
function deletaTabela(refTabela){
    let listaNosLinhasTabela = refTabela.querySelectorAll("tr");
    for (let i = 1; i < listaNosLinhasTabela.length; i++) {
        listaNosLinhasTabela[i].remove();
    }
}
/*
CRIAR FUNCAO PARA VALIDAR NOME E RETORNAR CODIGO DE ERRO INTEGER.
QUANDO RETORNAR 0 == Nome Válido
                1 == Erro - Informe um nome com pelo menos 4 caracteres.
                2 == Erro - Nome não pode começar com número.
                3 == Erro - Nome não pode conter apenas números.
                4 == Erro - Nome não pode conter estes caracters: ()!=+~][{}]/* 
ADICIONAR VALIDACAO NO CAMPO NOME
 - NAO ADICIONAR CONTATO COM NOME SOMENTE NUMEROS. 
 - NAO PERMITIR ADICIONAR CONTATO COM NUMERO NO INICIO DO NOME
 - NAO PERMITIR ADICIONAR NOMES MENORES QUE 4 LETRAS OU 4 CARACTERS.
*/
function validaNome(nomeCampo){
    let charNaoPermitidos = ['(',')','!','=','+','~','[',']','{','}','/','*','\\', '^', 'ª', 'º', '§', '_', '@', '#', '"',"'", '$', '%', '¢', '¨', '¬', '?', '&', '.', ',', ';', ';', '-'];
    let comecarNumero = ['0','1','2','3','4','5','6','7','8','9'];
    let deveConterLetra = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Z']
    if (nomeCampo.length < 4) {
        return 1;
    }
    for (let volta = 0; volta < nomeCampo.length; volta++) {
        let testeLetras = false
        for (let i = 0; i < charNaoPermitidos.length; i++) {
            if (nomeCampo[volta] == charNaoPermitidos[i]) {
                return 4;
            } 
        } 
        for (let x = 0; x < deveConterLetra.length; x++) {
            if (nomeCampo[volta] == deveConterLetra[x]) {
                testeLetras = true
                break;
            }
        }
        if (testeLetras = false) {
            return 3;
        }
    }   
    for (let j = 0; j < comecarNumero.length; j++) {
        if (nomeCampo[0] == comecarNumero[j]) {
            return 2;
        }
    }  
    return 0;   
}
// Esta funcao vai validar se o telefone possui DDD e numeros validos
function validaTel(telefoneStr){
    let caracteresPermitidos = ['0','1','2','3','4','5','6','7','8','9','+','(',')','-',' '];
    let telPermitido = "";
    for (let volta = 0; volta < telefoneStr.length; volta = volta + 1){
        let testeChar = false;
        for (let j = 0; j < caracteresPermitidos.length; j++) {
            if (telefoneStr[volta] == caracteresPermitidos[j]) {
                telPermitido = telPermitido + telefoneStr[volta]; 
                testeChar = true;
                break;
            }
        } 
        if(testeChar == false){
            return [1];
        }  
    } 
    //Se todos os caracteres informados forem permitidos, validar quantidade de espaços entre os caracteres.
    for (let x = 1; x < telPermitido.length; x++) {
        if (telPermitido[x] == " " && telPermitido[x-1] == " " ) {
            return [1];
        }
    }
    // Validando se o usuario informou o DDD e se o numero é telefone celular ou fixo.
    let caracteresFormatados = ['0','1','2','3','4','5','6','7','8','9'];
    let telFormatado = "";
    // For para retirar os caracteres especiais para fazer a validação
    for (let i = 0; i < telPermitido.length; i++) {
        for (let c = 0; c < caracteresFormatados.length; c++) {
            if (telPermitido[i] == caracteresFormatados[c]) {
                telFormatado = telFormatado + telPermitido[i]; 
                break;
            }
        }
    } 
    // Se a quantidade de caracteres for menor que 8 significa que o telefone é invalido
    if (telFormatado.length < 8) {
        return [1];
    }
    // Se a quantidade de caracteres forem igual a 9 significa que o usuario informou um tel celular sem DDD
    if (telFormatado.length == 9) {
        return [3];
    }
    // Quando os caracteres formatados forem igual a 8 significa que o usuario inforou um tel fixo sem DDD.
    if (telFormatado.length == 8) {
        return [2];
    }
    // Se for maior do que 15 telefone invalido
    if (telFormatado.length > 15) {
        return [1];
    }
    return [0,telFormatado];
}
// Esta função cria um armazenamento na memoria local do navegador.
// Se o armazenamento ja existir, a função rotorna false, pois nao criou o armazenamento.
// Quando o retorno da função for true significa que ocorreu a criação de um novo armazenamento.
// A criação de uma nova memoria local ocorre geralmente no primeiro acesso do usuário à aplicação.
function addBaseLocalNaveg() {
    if (localStorage.getItem('listaContatos') === null) {
        localStorage.setItem('listaContatos', JSON.stringify([]));
        return true;
    }
    return false;
}
let adicionouBaseLocal = addBaseLocalNaveg();
let fonteDados = JSON.parse(localStorage.getItem('listaContatos'));
if (!adicionouBaseLocal) {
    exibirLista(fonteDados);
}

