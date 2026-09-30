/* ==========================================================================
   AGUARDAR CARREGAMENTO DA DOM E APLICAR MÁSCARAS E VALIDAÇÕES
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("cadastroForm");
    const inputCpf = document.getElementById("cpf");
    const inputTelefone = document.getElementById("telefone");

    /* ==========================================================================
       LÓGICA DA MÁSCARA DE CPF (Formato: 000.000.000-00)
       ========================================================================== */
    if (inputCpf) {
        inputCpf.addEventListener("input", (e) => {
            let valor = e.target.value;

            // Remove qualquer caractere que não seja número
            valor = valor.replace(/\D/g, "");

            // Limita a 11 dígitos
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }

            // Aplica a formatação do CPF
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            e.target.value = valor;
        });
    }

    /* ==========================================================================
       LÓGICA DA MÁSCARA DE TELEFONE ((XX) XXXXX-XXXX ou (XX) XXXX-XXXX)
       ========================================================================== */
    if (inputTelefone) {
        inputTelefone.addEventListener("input", (e) => {
            let valor = e.target.value;

            valor = valor.replace(/\D/g, "");

            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }

            valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");

            if (valor.replace(/\D/g, "").length === 11) {
                valor = valor.replace(/(\s\d{5})(\d)/, "$1-$2");
            } else {
                valor = valor.replace(/(\s\d{4})(\d)/, "$1-$2");
            }

            e.target.value = valor;
        });
    }

    /* ==========================================================================
       FUNÇÕES DE ERRO DINÂMICO NA DOM
       ========================================================================== */
    function mostrarErroCpf(input, mensagem) {
        input.classList.add("input-error");
        const containerPai = input.parentElement;
        let mensagemExistente = containerPai.querySelector(".error-message");

        if (!mensagemExistente) {
            const spanErro = document.createElement("span");
            spanErro.classList.add("error-message");
            spanErro.innerText = mensagem;
            containerPai.appendChild(spanErro);
        }
    }

    function removerErroCpf(input) {
        input.classList.remove("input-error");
        const containerPai = input.parentElement;
        const mensagemExistente = containerPai.querySelector(".error-message");

        if (mensagemExistente) {
            mensagemExistente.remove();
        }
    }

    /* ==========================================================================
       VALIDAÇÃO VISUAL EM TEMPO REAL (EVENTO BLUR)
       ========================================================================== */
    if (inputCpf) {
        inputCpf.addEventListener("blur", () => {
            const cpfApenasNumeros = inputCpf.value.replace(/\D/g, "");

            if (cpfApenasNumeros.length === 0) {
                removerErroCpf(inputCpf);
                return;
            }

            if (!validarCPF(cpfApenasNumeros)) {
                mostrarErroCpf(inputCpf, "⚠️ CPF inválido. Tente novamente.");
            } else {
                removerErroCpf(inputCpf);
            }
        });
    }

    /* ==========================================================================
       INTERCEPTAÇÃO DO ENVIO DO FORMULÁRIO (SUBMIT)
       ========================================================================== */
    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            const cpfApenasNumeros = inputCpf.value.replace(/\D/g, "");

            // Se o CPF for matematicamente inválido, bloqueia a submissão
            if (!validarCPF(cpfApenasNumeros)) {
                mostrarErroCpf(inputCpf, "⚠️ CPF inválido. Verifique o número antes de concluir.");
                inputCpf.focus();
                e.preventDefault();
                return;
            }

            // Se passou, prossegue com o envio do objeto
            e.preventDefault(); // Impede o recarregamento padrão da página

            const formData = {
                nome: document.getElementById("nome").value,
                email: document.getElementById("email").value,
                telefone: document.getElementById("telefone").value,
                nascimento: document.getElementById("nascimento").value,
                cpf: inputCpf.value,
                area: document.getElementById("area").value,
                nivel: document.querySelector('input[name="nivel"]:checked')?.value || "Não informado",
                biografia: document.getElementById("biografia").value,
                aceitaNovidades: document.getElementById("novidades").checked,
                instagram: document.getElementById("instagram").value,
                github: document.getElementById("github").value
            };

            console.log("Dados do formulário enviados com sucesso:", formData);
            alert("Cadastro concluído com sucesso!");
        });
    }
});

/* ==========================================================================
   FUNÇÃO MATEMÁTICA PARA VALIDAÇÃO DE CPF
   ========================================================================== */
function validarCPF(cpfLimpo) {
    if (cpfLimpo.length !== 11) return false;

    // Elimina CPFs com dígitos todos iguais (ex: 11111111111)
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    // Validação do Primeiro Dígito Verificador
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

    // Validação do Segundo Dígito Verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

    return true;
}
