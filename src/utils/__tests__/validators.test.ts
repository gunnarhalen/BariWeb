import { describe, expect, it } from "vitest";
import {
  cep,
  cnpj,
  cpf,
  email,
  errorMessage,
  phone,
  required,
  strongPassword,
  validate,
} from "../validators";

describe("required", () => {
  it("aceita texto preenchido", () => {
    expect(required("Bari")).toBe(true);
  });

  it("rejeita string vazia", () => {
    expect(required("")).toBe(false);
  });

  it("rejeita apenas espaços", () => {
    expect(required("   ")).toBe(false);
  });
});

describe("email", () => {
  it("aceita e-mail válido", () => {
    expect(email("nutricionista@bari.com.br")).toBe(true);
  });

  it("rejeita e-mail sem domínio", () => {
    expect(email("nutricionista@")).toBe(false);
  });

  it("rejeita e-mail sem @", () => {
    expect(email("nutricionista.bari.com")).toBe(false);
  });

  it("rejeita e-mail vazio", () => {
    expect(email("")).toBe(false);
  });
});

describe("cpf", () => {
  it("aceita CPF válido com máscara", () => {
    expect(cpf("529.982.247-25")).toBe(true);
  });

  it("aceita CPF válido sem máscara", () => {
    expect(cpf("52998224725")).toBe(true);
  });

  it("rejeita CPF com dígitos verificadores inválidos", () => {
    expect(cpf("529.982.247-24")).toBe(false);
  });

  it("rejeita CPF com tamanho incorreto", () => {
    expect(cpf("5299822472")).toBe(false);
  });

  it("rejeita CPF com todos os dígitos iguais", () => {
    expect(cpf("111.111.111-11")).toBe(false);
  });

  it("rejeita CPF vazio", () => {
    expect(cpf("")).toBe(false);
  });
});

describe("cnpj", () => {
  it("aceita CNPJ válido com máscara", () => {
    expect(cnpj("11.222.333/0001-81")).toBe(true);
  });

  it("aceita CNPJ válido sem máscara", () => {
    expect(cnpj("11222333000181")).toBe(true);
  });

  it("rejeita CNPJ com dígitos verificadores inválidos", () => {
    expect(cnpj("11.222.333/0001-80")).toBe(false);
  });

  it("rejeita CNPJ com tamanho incorreto", () => {
    expect(cnpj("112223330001")).toBe(false);
  });

  it("rejeita CNPJ com todos os dígitos iguais", () => {
    expect(cnpj("11.111.111/1111-11")).toBe(false);
  });

  it("rejeita CNPJ vazio", () => {
    expect(cnpj("")).toBe(false);
  });
});

describe("phone", () => {
  it("aceita celular com máscara", () => {
    expect(phone("(11) 91234-5678")).toBe(true);
  });

  it("aceita telefone fixo sem máscara", () => {
    expect(phone("1132145678")).toBe(true);
  });

  it("rejeita telefone com poucos dígitos", () => {
    expect(phone("123456789")).toBe(false);
  });

  it("rejeita telefone com dígitos demais", () => {
    expect(phone("119123456789")).toBe(false);
  });

  it("rejeita telefone vazio", () => {
    expect(phone("")).toBe(false);
  });
});

describe("cep", () => {
  it("aceita CEP com máscara", () => {
    expect(cep("01310-100")).toBe(true);
  });

  it("aceita CEP sem máscara", () => {
    expect(cep("01310100")).toBe(true);
  });

  it("rejeita CEP com poucos dígitos", () => {
    expect(cep("0131010")).toBe(false);
  });

  it("rejeita CEP com dígitos demais", () => {
    expect(cep("013101000")).toBe(false);
  });

  it("rejeita CEP vazio", () => {
    expect(cep("")).toBe(false);
  });
});

describe("strongPassword", () => {
  it("aceita senha forte", () => {
    expect(strongPassword("Abc@1234")).toBe(true);
  });

  it("rejeita senha sem letra maiúscula", () => {
    expect(strongPassword("abc@1234")).toBe(false);
  });

  it("rejeita senha sem letra minúscula", () => {
    expect(strongPassword("ABC@1234")).toBe(false);
  });

  it("rejeita senha sem número", () => {
    expect(strongPassword("Abc@defg")).toBe(false);
  });

  it("rejeita senha sem caractere especial", () => {
    expect(strongPassword("Abcd1234")).toBe(false);
  });

  it("rejeita senha com menos de 8 caracteres", () => {
    expect(strongPassword("Ab@123")).toBe(false);
  });

  it("rejeita senha vazia", () => {
    expect(strongPassword("")).toBe(false);
  });
});

describe("errorMessage", () => {
  it("retorna a mensagem de cada regra", () => {
    expect(errorMessage("required")).toBe("Campo obrigatório");
    expect(errorMessage("email")).toBe("E-mail inválido");
    expect(errorMessage("cpf")).toBe("CPF inválido");
    expect(errorMessage("cnpj")).toBe("CNPJ inválido");
    expect(errorMessage("phone")).toBe("Telefone inválido");
    expect(errorMessage("cep")).toBe("CEP inválido");
    expect(errorMessage("strongPassword")).toContain("8 caracteres");
  });
});

describe("validate", () => {
  it("retorna objeto vazio quando todos os campos são válidos", () => {
    const errors = validate(
      {
        email: "nutricionista@bari.com.br",
        password: "Abc@1234",
      },
      {
        email: ["required", "email"],
        password: ["required", "strongPassword"],
      }
    );

    expect(errors).toEqual({});
  });

  it("retorna apenas os campos inválidos com suas mensagens", () => {
    const errors = validate(
      {
        email: "invalido",
        password: "fraca",
      },
      {
        email: ["required", "email"],
        password: ["required", "strongPassword"],
      }
    );

    expect(errors).toEqual({
      email: "E-mail inválido",
      password: expect.stringContaining("8 caracteres"),
    });
  });

  it("prioriza a mensagem de obrigatório para campos vazios", () => {
    const errors = validate(
      { email: "" },
      { email: ["email", "required"] }
    );

    expect(errors).toEqual({ email: "Campo obrigatório" });
  });

  it("trata campos ausentes como vazios", () => {
    const errors = validate({}, { name: ["required"] });

    expect(errors).toEqual({ name: "Campo obrigatório" });
  });
});
