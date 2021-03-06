window.onload = function () {
	let palavra;
	let categoria;
	let letrasCorretas = [];
	let letrasErradas = [];
	let controleDesenho = 0;
	let controleDesenhoMaximo = 7;
	const desenhos = ["cabeca.png", "corpo.png", "bracoD.png", "bracoE.png", "pernaD.png", "pernaE.png", "morte.png"];

	const jogarButton = document.querySelector('[data-button="jogar"]');
	const zerarButton = document.querySelector('[data-button="zerar"]');

   
	jogarButton.addEventListener('click', jogar);
	zerarButton.addEventListener('click', zerarJogo);

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
	  
	function gerarBlocos() {
		let length = palavra.length;
		let divPalavra = document.getElementById('divPalavra');
		divPalavra.innerHTML = '';

		for (key = 0; key < palavra.length; key++) {
			divPalavra.insertAdjacentHTML('beforeend', `
				<label id="letra${key}" class="letra" maxlength="1" disabled></label>
			`)
		}
	};

	function gerarPalavra(numeroDica) {
		let ultimoIndice = categorias[numeroDica].palavras.length - 1;
		let primeiroIndice = 0;
		let numeroPalavra = sortearNumeroAleatorio(primeiroIndice, ultimoIndice);
		palavra = categorias[numeroDica].palavras[numeroPalavra];
		
		gerarBlocos();
	}

	function gerarDica() {
		let ultimoIndice = categorias.length - 1;
		let primeiroIndice = 0;
		let numeroDica = sortearNumeroAleatorio(primeiroIndice, ultimoIndice);
		categoria = categorias[numeroDica].nome;

		const spanDica = document.querySelector('#dica span');	
		spanDica.innerText = categoria;
		gerarPalavra(numeroDica);		
	}

	function pegaLetraDigitada() {
		const inputLetra = document.getElementById('letraJogador');

		return inputLetra.value;
	}

	function pegaIndicesDaLetra(letra) {
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
	
	function adicionarLetrasErradas(letra) {
		letrasErradas.push(letra);
		document.querySelector("#divLetrasDigitas span").innerHTML = letrasErradas.join(", ");

	}

	function adicionarLetrasCertas(letra, indicesLetra) {
		indicesLetra.forEach(function (indice) {
			document.getElementById("letra" + indice).innerHTML = letra;
		})
	}

	function desenharBoneco() {
		let estrutura = document.getElementById("estrutura");
		estrutura.src = desenhos[controleDesenho];
	}
	
	function gerenciarControleBoneco() {
		controleDesenho++;	
	}

	// function controleAcertos() {
	// 	// if (resultados[0] == resultados[1] && resultados[0] == resultados[2]) {
	// 	if (inputLetra == length) {
	// 		msgTela = "Parabens você ganhou.";
	// 		document.getElementById("divMsg").innerHTML = "";
	// 		document.getElementById("divMsg").innerHTML = msgTela.toUpperCase();
	// 		document.getElementById("letraJogador").disabled = true;
	// 		console.log(msgTela);
	// 	}
	// }

	function controleErros() {
		if(controleDesenho === controleDesenhoMaximo) {
			msgTela = "Limite de erros máximos atigindos.";
			document.getElementById("divMsg").innerHTML = msgTela;
			document.getElementById("letraJogador").disabled = true;	
		} 	
	}

	function jogar() {
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
			//controleAcertos();
			controleErros();
		}
	}
	
	function carregarJogo() {
		escolherTipoJogo();
		gerarDica();
	}

	function zerarJogo() {
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
}

