window.onload = function () {
	let palavra;
	let categoria;
	let letrasCorretas = [];
	let letrasErradas = [];
	let controleDesenho = 0;
	let controleDesenhoMaximo = 7;
	const desenhos = ["cabeca.png", "corpo.png", "bracoD.png", "bracoE.png", "pernaD.png", "pernaE.png", "morte.png"];
	const frutas = [];
	const carros = [];
	const cidades = [];
	frutas.push("abacaxi","acerola","amora","banana","cereja","goiaba","laranja","limao","maça","maracuja","melancia","melao","morango","pessego","tangerina");
	carros.push("gol","hrv","civic","palio","fox","onix","sandero","versa","golf","jetta","hb20","newfiesta","focus","saveiro","ix35");
	cidades.push("porto alegre","recife","curitiba","manaus","belo horizonte","fortaleza","salvador","brasilia","rio de janeiro","sao paulo","vitoria","joinville","campinas","uberaba","limeira");
	const categorias = [];
	categorias.push({
		nome: 'FRUTAS',
		palavras: frutas
	});
	categorias.push({	
		nome: 'CARROS',
		palavras: carros
	});
	categorias.push({
		nome: 'CIDADES',
		palavras: cidades
	});

	const jogarButton = document.querySelector('[data-button="jogar"]');
	const preButton = document.querySelector('[data-button="pre"]');
	const digitadaButton = document.querySelector('[data-button="digitada"]');

	jogarButton.addEventListener('click', jogar);
	preButton.addEventListener('click', iniciarJogoPre);
	digitadaButton.addEventListener('click', iniciarJogoDigitada);

	carregarJogo();
	
	function escolherTipoJogo() { //decir tipo de jogo pre ou selecionado
		const buttons = document.querySelectorAll('[data-tipo-jogo]');

		buttons.forEach(function (button) {
			// ITERAR
			button.addEventListener('click', function (event) {
				const conteudos = document.querySelectorAll('[data-conteudo]');
		
				conteudos.forEach(function (conteudo) {
					conteudo.classList.add('escondido')
				});
		
				const tipo = event.target.dataset['tipoJogo'];
				//console.log(tipo);

				mostraConteudoJogo(tipo);
			});
		});
	}

	function mostraConteudoJogo(tipo) {
		const conteudo = document.querySelector('[data-conteudo=' + tipo + ']');
	
		conteudo.classList.remove('escondido');
	}
	
	function sortearNumeroAleatorio(min, max) { // sortar dica e palavra
		return Math.round(Math.random() * (max - min) + min);
	  }
	  
	function gerarBlocos() { // FAZER OS LENGTH EM TAMANHO DAS LETRAS DA PALAVRA.
		let length = palavra.length;
		let divPalavra = document.getElementById('divPalavra');
		divPalavra.innerHTML = '';

		for (key = 0; key < palavra.length; key++) {
			divPalavra.insertAdjacentHTML('beforeend', `
				<label id="letra${key}" class="letra" maxlength="1" disabled></label>
			`)
		}
	};

	function gerarPalavra(numeroDica) { //SORTEAR UMA PALAVRA NOS ARRAY DE 1 A 15
		let ultimoIndice = categorias[numeroDica].palavras.length - 1;
		let primeiroIndice = 0;
		let numeroPalavra = sortearNumeroAleatorio(primeiroIndice, ultimoIndice);
		palavra = categorias[numeroDica].palavras[numeroPalavra].replace(/ /g, "");
		
		gerarBlocos();
	}

	function gerarDica() { //SORTEAR UMA PALAVRA NOS 3 ARRAY('FRUTAS, CARROS, CIDADES')
		let ultimoIndice = categorias.length - 1;
		let primeiroIndice = 0;
		let numeroDica = sortearNumeroAleatorio(primeiroIndice, ultimoIndice);
		categoria = categorias[numeroDica].nome;

		const spanDica = document.querySelector('#dica span');	
		spanDica.innerText = categoria;
		gerarPalavra(numeroDica);		
	}

	function pegaLetraDigitada() { // PEGAR LETRA DIGITADA DO JOGADOR
		const inputLetra = document.getElementById('letraJogador');
		
		return inputLetra.value.toLowerCase();
	}

	function pegaIndicesDaLetra(letra) { //COMPARAR A LETRA DIGITADA SE É ENCONTRADA NA PALAVRA OU NAO
		if (letra) {
			var i = -1;
			var indexes = [];
	
			while ((i = palavra.indexOf(letra, i + 1)) != -1) {
				indexes.push(i);
			
			}
	
			return indexes;
		}

		return [];
	}
	
	function adicionarLetrasErradas(letra) { // PEGAR LETRA DIGITADA ERRADA PELO USARIO 
		letrasErradas.push(letra);
		document.querySelector("#divLetrasDigitas span").innerHTML = letrasErradas.join(", ");

	}

	function adicionarLetrasCertas(letra, indicesLetra) { // PEGAR LETRA DIGITADA CERTA PELO USARIO 
		letrasCorretas.push(letra);
		indicesLetra.forEach(function (indice) {
			document.getElementById("letra" + indice).innerHTML = letra;
		})
	}

	function desenharBoneco() { //DESENHAR O JOGO DA FORCANA TELA COM COMEÇO A IMAGEM DA ESTRUTURA
		let estrutura = document.getElementById("estrutura");
		estrutura.src = desenhos[controleDesenho];
	}
	
	function gerenciarControleBoneco() { //GERENCIAR CONTROLE DO DESENHO AO ERRAR LETRA DIGITADA, SOMA DESENHO
		controleDesenho++;	
	}

	function verificarSeGanhouOuPerdeu() { //VERIFICAR SE O USARIO GANHOU OU PERDEU
		let divMsg = document.getElementById("divMsg");

		if (controleDesenho === controleDesenhoMaximo) {
			msgTela = "Limite de erros máximos atigindos.";

			divMsg.innerHTML = msgTela;
			divMsg.style.color = 'red';

			document.getElementById("letraJogador").disabled = true;	
		}

		let palavraVerifica = palavra;

		letrasCorretas.forEach(function (letra) {
			palavraVerifica = palavraVerifica.replace(new RegExp(letra, 'g'), '')
		});		//https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string

		if (palavraVerifica.length == 0) {
			msgTela = "Parabéns você ganhou!!!";

			divMsg.innerHTML = msgTela;
			divMsg.style.color = 'green';
			document.getElementById("letraJogador").disabled = true;
			document.getElementById('palavra-digitada').disabled = true;
			document.getElementById('dica-digitada').disabled = true;
		}
	}

	function jogar() { // FUNCAO GERAL DO JOGO
		const letra = pegaLetraDigitada();
		const indicesLetra = pegaIndicesDaLetra(letra);
		document.getElementById("divMsg").innerHTML = "";

		if (letrasCorretas.includes(letra) || letrasErradas.includes(letra)) {
			msgTela = "Letra já digitada.";
			document.getElementById("divMsg").innerHTML = msgTela.toUpperCase();
			return;
		}

		if (indicesLetra.length > 0) {
			adicionarLetrasCertas(letra, indicesLetra);
		} else {
			adicionarLetrasErradas(letra);
			desenharBoneco();
			gerenciarControleBoneco();
		}
		
		verificarSeGanhouOuPerdeu();
	}
	
	function carregarJogo() {
		escolherTipoJogo();
		gerarDica();
	}

	function iniciarJogoPre() { // FUNCAO DO JOGO QUE O SISTEMA DECIDE A PALAVRA E A DICA
		letrasCorretas = [];
		letrasErradas = [];
		controleDesenho = 0;
		let estrutura = document.getElementById("estrutura");
		estrutura.src = "estrutura.png";
		gerarDica();
		document.getElementById("letraJogador").disabled = false;
		document.getElementById("divMsg").innerHTML = "";
		document.querySelector("#divLetrasDigitas span").innerHTML = "";
	}

	function iniciarJogoDigitada() { // FUNCAO QUE O USARIO DECIDE A PALAVRA E A DICA
		letrasCorretas = [];
		letrasErradas = [];
		controleDesenho = 0;
		let estrutura = document.getElementById("estrutura");
		estrutura.src = "estrutura.png";
		
		palavra = document.getElementById('palavra-digitada').value.replace(/\s/g, "").toLowerCase();
		categoria = document.getElementById('dica-digitada').value;
		gerarBlocos();

		const spanDica = document.querySelector('#dica span');
		spanDica.innerText = categoria;

		
		document.getElementById("divMsg").innerHTML = "";
		document.querySelector("#divLetrasDigitas span").innerHTML = "";
		document.getElementById("letraJogador").disabled = false;
		document.getElementById('palavra-digitada').disabled = false;
		document.getElementById('dica-digitada').disabled = false;	
	}
}

