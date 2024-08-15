import React, {useState} from 'react';
import InputMask from 'react-input-mask';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/customize.scss';
import * as XLSX from 'xlsx';

const App: React.FC = () => {

  // Estado para os campos de informações gerais
  const [name, setName] = useState<string>('');
  const [fantasyName, setFantasyName] = useState<string>('');
  const [foundationDate, setFoundationDate] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [complement, setComplement] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [cpfCnpj, setCpfCnpj] = useState<string>('');
  const [stateRegistration, setStateRegistration] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Estado para os campos de administradores/sócios
  const [partners, setPartners] = useState<{ name: string; role: string; participation: string; cpf: string }[]>([]);

  // Estado para os campos de referências comerciais
  const [commercialReferences, setCommercialReferences] = useState<{ supplier: string; city: string; state: string }[]>([]);

  // Funções para adicionar novos sócios e referências
  const handleAddPartner = () => {
    setPartners([...partners, {name: '', role: '', participation: '', cpf: ''}]);
  };

  const handleAddReference = () => {
    setCommercialReferences([...commercialReferences, {supplier: '', city: '', state: ''}]);
  };

  // Funções para remover sócios e referências
  const handleRemovePartner = (index: number) => {
    setPartners(partners.filter((_, i) => i !== index));
  };

  const handleRemoveReference = (index: number) => {
    setCommercialReferences(commercialReferences.filter((_, i) => i !== index));
  };

  // Função para limpar o formulário
  const clearForm = () => {
    setName('');
    setFantasyName('');
    setFoundationDate('');
    setAddress('');
    setNumber('');
    setComplement('');
    setDistrict('');
    setZipCode('');
    setCity('');
    setState('');
    setCpfCnpj('');
    setStateRegistration('');
    setPhone('');
    setMobile('');
    setEmail('');
    setPartners([]);
    setCommercialReferences([]);
  };

  // Função para formatar o valor de CPF/CNPJ com base na máscara
  const formatCpfCnpj = (value: string) => {
    let formattedValue = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

    if (formattedValue.length <= 11) {
      // Formatação para CPF
      formattedValue = formattedValue
        .replace(/^(\d{3})(\d{3})/, '$1.$2')
        .replace(/^(\d{3})(\d{6})/, '$1.$2')
        .replace(/(\d{3})(\d{2})$/, '.$1-$2');
    } else {
      // Formatação para CNPJ
      formattedValue = formattedValue
        .replace(/^(\d{2})(\d{3})/, '$1.$2')
        .replace(/\.(\d{3})(\d{3})/, '.$1.$2')
        .replace(/\.(\d{3})(\d{4})/, '.$1/$2')
        .replace(/(\d{4})(\d{2})$/, '$1-$2');
    }

    return formattedValue;
  };

  // Função para atualizar o CPF/CNPJ no estado
  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (rawValue.length <= 14) {
      setCpfCnpj(formatCpfCnpj(rawValue)); // Atualiza o estado com o valor formatado
    }
  };

  // Função para submissão do formulário
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (commercialReferences?.length > 4) {

      const generalInfoData = [
        ['Nome / Razão Social', name],
        ['Nome Fantasia', fantasyName],
        ['Data de Fundação', foundationDate],
        ['Endereço', address],
        ['Número', number],
        ['Complemento', complement],
        ['Bairro', district],
        ['CEP', zipCode],
        ['Cidade', city],
        ['Estado', state],
        ['CPF / CNPJ', cpfCnpj],
        ['Inscrição Estadual', stateRegistration],
        ['Telefone', phone],
        ['Celular', mobile],
        ['Email', email],
      ];

      const partnersData = partners.map((partner) => ({
        'Nome Completo': partner.name,
        'Cargo / Função': partner.role,
        'Participação (%)': partner.participation,
        'CPF': partner.cpf,
      }));

      const commercialReferencesData = commercialReferences.map((reference) => ({
        'Fornecedor': reference.supplier,
        'Cidade': reference.city,
        'Estado': reference.state,
      }));

      const workbook = XLSX.utils.book_new();

      // Adicionando a planilha de Informações Gerais
      const wsGeneralInfo = XLSX.utils.aoa_to_sheet(generalInfoData);
      XLSX.utils.book_append_sheet(workbook, wsGeneralInfo, 'Informacoes_Gerais');  // Nome da planilha sem caracteres proibidos

      // Adicionando a planilha de Sócios
      const wsPartners = XLSX.utils.json_to_sheet(partnersData);
      XLSX.utils.book_append_sheet(workbook, wsPartners, 'Socios');  // Nome da planilha sem caracteres proibidos

      // Adicionando a planilha de Referências Comerciais
      const wsCommercialReferences = XLSX.utils.json_to_sheet(commercialReferencesData);
      XLSX.utils.book_append_sheet(workbook, wsCommercialReferences, 'Referencias_Comerciais');  // Nome da planilha sem caracteres proibidos

      // Gerando o arquivo Excel com o nome "Ficha + Nome Fantasia"
      const fileName = `Ficha_${fantasyName.replace(/[\\/:*?"<>|]/g, '')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      // Limpar o formulário após a exportação
      clearForm();
    } else {
      alert('Por favor incluir no mínimo 5 "REFERENCIAS COMERCIAIS"');
    }
  };

  return (
    <div className="container" style={{minWidth: '100vw', minHeight: '100vh', padding: '20px', overflowY: 'hidden', maxWidth: '100vw'}}>
      <h1>Ficha Cadastral</h1>
      <form onSubmit={handleSubmit}>
        <h3>Informações Gerais</h3>
        <div className="row">
          <div className="form-floating col-md-6 mb-3">
            <input type="text" className="form-control" id="name" placeholder="" value={name} onChange={(e) => setName(e.target.value)} required/>
            <label htmlFor="name">Nome / Razão Social</label>
          </div>
          <div className="form-floating col-md-6 mb-3">
            <input type="text" className="form-control form-control-sm" id="fantasyName" placeholder="" value={fantasyName} onChange={(e) => setFantasyName(e.target.value)} required/>
            <label htmlFor="fantasyName" className="form-label">Nome Fantasia</label>
          </div>
        </div>
        <div className="row">
          <div className="form-floating col-md-3 mb-3">
            <input type="date" className="form-control form-control-sm" id="foundationDate" placeholder="" value={foundationDate} onChange={(e) => setFoundationDate(e.target.value)} required/>
            <label htmlFor="foundationDate" className="form-label">Data de Fundação</label>
          </div>
          <div className="form-floating col-md-9 mb-3">
            <input type="text" className="form-control form-control-sm" id="address" placeholder="" value={address} onChange={(e) => setAddress(e.target.value)} required/>
            <label htmlFor="address" className="form-label">Endereço</label>
          </div>
        </div>
        <div className="row">
          <div className="form-floating col-md-3 mb-3">
            <input type="text" className="form-control form-control-sm" id="number" placeholder="" value={number} onChange={(e) => setNumber(e.target.value)} required/>
            <label htmlFor="number" className="form-label">Número</label>
          </div>
          <div className="form-floating col-md-3 mb-3">
            <input type="text" className="form-control form-control-sm" id="complement" placeholder="" value={complement} onChange={(e) => setComplement(e.target.value)}/>
            <label htmlFor="complement" className="form-label">Complemento</label>
          </div>
          <div className="form-floating col-md-6 mb-3">
            <input type="text" className="form-control form-control-sm" id="district" placeholder="" value={district} onChange={(e) => setDistrict(e.target.value)} required/>
            <label htmlFor="district" className="form-label">Bairro</label>
          </div>
        </div>
        <div className="row">
          <div className="form-floating col-md-4 mb-3">
            <InputMask
              mask="99999-999"
              className="form-control form-control-sm"
              id="zipCode"
              placeholder=""
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
            <label htmlFor="zipCode" className="form-label">CEP</label>
          </div>
          <div className="form-floating col-md-4 mb-3">
            <input type="text" className="form-control form-control-sm" id="city" placeholder="" value={city} onChange={(e) => setCity(e.target.value)} required/>
            <label htmlFor="city" className="form-label">Cidade</label>
          </div>
          <div className="form-floating col-md-4 mb-3">
            <input type="text" className="form-control form-control-sm" id="state" placeholder="" value={state} onChange={(e) => setState(e.target.value)} required/>
            <label htmlFor="state" className="form-label">Estado</label>
          </div>
        </div>
        <div className="row">
          <div className="form-floating col-md-6 mb-3">
            <InputMask
              mask={''}
              className="form-control form-control-sm"
              id="cpfCnpj"
              placeholder=""
              value={cpfCnpj}
              onChange={handleCpfCnpjChange}
              required
            />
            <label htmlFor="cpfCnpj" className="form-label">CPF / CNPJ</label>
          </div>
          <div className="form-floating col-md-6 mb-3">
            <input type="text" className="form-control form-control-sm" id="stateRegistration" placeholder="" value={stateRegistration} onChange={(e) => setStateRegistration(e.target.value)}/>
            <label htmlFor="stateRegistration" className="form-label">Inscrição Estadual</label>
          </div>
        </div>
        <div className="row">
          <div className="form-floating col-md-6 mb-3">
            <InputMask
              mask="(99) 9999-9999"
              className="form-control form-control-sm"
              id="phone"
              placeholder=""
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <label htmlFor="phone" className="form-label">Telefone</label>
          </div>
          <div className="form-floating col-md-6 mb-3">
            <InputMask
              mask="(99) 9 9999-9999"
              className="form-control form-control-sm"
              id="mobile"
              placeholder=""
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
            <label htmlFor="mobile" className="form-label">Celular</label>
          </div>
        </div>
        <div className="form-floating mb-3">
          <input type="email" className="form-control form-control-sm" id="email" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          <label htmlFor="email" className="form-label">Email</label>
        </div>
        <h3>Sócios / Administradores</h3>
        {partners.map((partner, index) => (
          <div key={index} className="row">
            <div className="form-floating col-md-3 mb-3">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder=""
                id="partnerName"
                value={partner.name}
                onChange={(e) =>
                  setPartners(
                    partners.map((p, i) =>
                      i === index ? {...p, name: e.target.value} : p
                    )
                  )
                }
                required
              />
              <label htmlFor="partnerName" className="form-label">Nome Completo</label>
            </div>
            <div className="form-floating col-md-3 mb-3">
              <input
                type="text"
                className="form-control form-control-sm"
                value={partner.role}
                id="role"
                placeholder=""
                onChange={(e) =>
                  setPartners(
                    partners.map((p, i) =>
                      i === index ? {...p, role: e.target.value} : p
                    )
                  )
                }
                required
              />
              <label htmlFor="role" className="form-label">Cargo / Função</label>
            </div>
            <div className="form-floating col-md-2 mb-3">
              <input
                type="text"
                className="form-control form-control-sm"
                value={partner.participation}
                id="partcipation"
                placeholder=""
                onChange={(e) =>
                  setPartners(
                    partners.map((p, i) =>
                      i === index ? {...p, participation: e.target.value} : p
                    )
                  )
                }
                required
              />
              <label htmlFor="partcipation" className="form-label">Participação (%)</label>
            </div>
            <div className="form-floating col-md-3 mb-3">
              <InputMask
                mask="999.999.999-99"
                className="form-control form-control-sm"
                value={partner.cpf}
                id="cpf" placeholder=""
                onChange={(e) =>
                  setPartners(
                    partners.map((p, i) =>
                      i === index ? {...p, cpf: e.target.value} : p
                    )
                  )
                }
                required
              />
              <label htmlFor="cpf" className="form-label">CPF</label>
            </div>
            <div className="col-md-1 mb-3 d-flex justify-content-end align-items-end">
              <button type="button" className="btn btn-danger" onClick={() => handleRemovePartner(index)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        <div className="row">
          <div className="col">
            <button type="button" className="btn btn-success mb-3 float-end" onClick={handleAddPartner}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <h3>Referências Comerciais</h3>
        {commercialReferences.map((reference, index) => (
          <div key={index} className="row">
            <div className="form-floating col-md-4 mb-3">
              <input
                type="text"
                className="form-control form-control-sm"
                value={reference.supplier}
                id="supplier" placeholder=""
                onChange={(e) =>
                  setCommercialReferences(
                    commercialReferences.map((r, i) =>
                      i === index ? {...r, supplier: e.target.value} : r
                    )
                  )
                }
                required
              />
              <label htmlFor="supplier" className="form-label">Fornecedor</label>
            </div>
            <div className="form-floating col-md-4 mb-3">
              <input
                type="text"
                className="form-control form-control-sm"
                value={reference.city}
                id="city" placeholder=""
                onChange={(e) =>
                  setCommercialReferences(
                    commercialReferences.map((r, i) =>
                      i === index ? {...r, city: e.target.value} : r
                    )
                  )
                }
                required
              />
              <label htmlFor="city" className="form-label">Cidade</label>
            </div>
            <div className="form-floating col-md-3 mb-3">
              <input
                type="text"
                className="form-control form-control-sm"
                value={reference.state}
                id="state"
                placeholder=""
                onChange={(e) =>
                  setCommercialReferences(
                    commercialReferences.map((r, i) =>
                      i === index ? {...r, state: e.target.value} : r
                    )
                  )
                }
                required
              />
              <label htmlFor="state" className="form-label">Estado</label>
            </div>
            <div className="col-md-1 mb-3 d-flex justify-content-end align-items-end">
              <button type="button" className="btn btn-danger float-end" onClick={() => handleRemoveReference(index)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
        <div className="row">
          <div className="col">
            <button type="button" className="btn btn-success mb-3 float-end" onClick={handleAddReference}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <button type="submit" className="btn btn-primary float-end">
              <i className="fas fa-file-excel"></i> Exportar
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default App;
