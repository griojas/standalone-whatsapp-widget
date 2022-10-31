/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const CLASS_NAME_WIDGET_TOGGLE = 'wa-widget-toggle'
const CLASS_NAME_WIDGET_CONTENT = 'wa-widget-content'
const CLASS_NAME_WIDGET_EXPANDED = 'expanded'
const CLASS_NAME_WIDGET_FORM_REQUIRED = 'required'

const SELECTOR_VALUE_TOGGLE_CHAT = 'wa-chat'
const SELECTOR_VALUE_TOGGLE_SEND = 'wa-send'

const SELECTOR_CHAT_WIDGET = '[data-chat]'
const SELECTOR_DATA_TOGGLE_CHAT = `[data-toggle="${SELECTOR_VALUE_TOGGLE_CHAT}"]`
const SELECTOR_DATA_TOGGLE_SEND = `[data-toggle="${SELECTOR_VALUE_TOGGLE_SEND}"]`
const SELECTOR_DATA_MESSAGE = `[data-message]`

const DefaultConfig = {
    name: '',
    division: '',
    photo: '',
    introduction: '',
    showHeader: false
}

const DefaultConfigType = {
    name: 'string',
    division: 'string',
    photo: 'string',
    introduction: 'string',
    showHeader: 'boolean'
}

const DefaultForm = [
    {
        data: 'name',
        type: 'text',
        required: true
    }, {
        data: 'message',
        type: 'text',
        required: true
    }
]

const DefaultFormType = {
    data: 'string',
    type: 'string',
    required: 'boolean'
}

const ChatData = {}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
export default class Chat {
    constructor(element, config, input) {
        if (ChatData[element.id])
            return

        this._element = element       
        this._config = this._getConfig(config)
        this._inputs =  this._getInput(input)
        this._phoneNumber = this._element.getAttribute('action')
        this._isShown = false
        this._showHeader = false
        this._toggleChat = ''
        this._contentElement = ''
        this._toggleSend = ''
        this._buildHTML()
        this._setEventListener()

        ChatData[element.id] = this
    }

    // PUBLIC
    toggle() {
        Object.keys(ChatData).forEach(key => {
            if (key !== this._element.id && ChatData[key]._isShown)
                ChatData[key].toggle()
        })

        this._isShown ? this._hide() : this._show()
    }

    // PRIVATE
    _sendMessage() {
        if (!/^\d+$/.test(this._phoneNumber)) {
            throw new Error('Phone number (' + this._phoneNumber + ') is invalid.')
        }

        const send_url = 'https://wa.me/'
        const inputs = this._element.querySelectorAll(SELECTOR_DATA_MESSAGE)
        let parameters = send_url + this._phoneNumber + '?text='
        let valid = true

        for (let i = 0; i < inputs.length; i++) {
            const item = inputs[i]
            if (!this._formValidation(item))
                valid = false

            const title = item.getAttribute('data-message')
            parameters += title.replace(/^./, title[0].toUpperCase()) + ': ' + item.value + '%0A'
        }

        if (valid) window.open(parameters, '_blank')
    }

    _buildHTML() {
        if (this._element.innerHTML) return false

        this._verifyInput(this._inputs)

        const TOGGLE = document.createElement('a')
        const ids = '#' + this._element.id
        TOGGLE.href = ids
        TOGGLE.classList.add(CLASS_NAME_WIDGET_TOGGLE)
        TOGGLE.setAttribute('data-toggle', SELECTOR_VALUE_TOGGLE_CHAT)
        TOGGLE.setAttribute('data-target', ids)
        // TOGGLE.innerHTML = 
        // `<svg viewBox="0 0 90 90" fill="rgb(79, 206, 93)" width="64" height="64">
        //     <path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455L0,90l7.975-23.522   c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982   c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537   c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938   c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537   c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333   c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882   c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977   c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344   c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223   C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z"></path>
        // </svg>`
        
        TOGGLE.innerHTML = `
          <svg viewBox="0 0 175.216 175.552" fill="rgb(79, 206, 93)" width="32" height="32">
            <defs><linearGradient id="b" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#57d163"/><stop offset="1" stop-color="#23b33a"/></linearGradient><filter id="a" width="1.115" height="1.114" x="-.057" y="-.057" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3.531"/></filter></defs><path fill="#b3b3b3" d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0" filter="url(#a)"/><path fill="#fff" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"/><path fill="url(#linearGradient1780)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z"/><path fill="url(#b)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"/><path fill="#fff" fill-rule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"/>
          </svg>
        `

        let HTML_ELEMENT_WIDGET_MAIN = ''

        if (this._config.showHeader) {
            HTML_ELEMENT_WIDGET_MAIN = 
            `${TOGGLE.outerHTML}
            <div class="${CLASS_NAME_WIDGET_CONTENT} chat-tab">
                <header class="chat-header">
                    <div class="chat-admin-picture">
                        <img src="${this._config.photo}" alt="${this._config.name}'s Photos">
                    </div>
                    <div class="chat-admin-details">
                        <h4>${this._config.name}</h4>
                        <p><small>${this._config.division}</small></p>
                    </div>
                </header>
                <div class="chat-content">
                    <div class="chat-item">
                        <p>${this._config.introduction}</p>
                    </div>
                </div>
                ${this._buildInputs(this._inputs).outerHTML}
            </div>`

        } else {

            HTML_ELEMENT_WIDGET_MAIN = 
          `${TOGGLE.outerHTML}
          <div class="${CLASS_NAME_WIDGET_CONTENT} chat-tab">
              <div class="chat-content">
                  <div class="chat-item">
                      <p>${this._config.introduction}</p>
                  </div>
              </div>
              ${this._buildInputs(this._inputs).outerHTML}
          </div>`
        }
        



        this._element.innerHTML = HTML_ELEMENT_WIDGET_MAIN
    }

    _buildInputs(inputs) {
        const form = document.createElement('div')
        form.classList.add('chat-form')

        inputs.forEach(input => {
            let newInput = document.createElement('input')
            newInput.type = input.type
            newInput.setAttribute('data-message', input.data)
            newInput.placeholder = input.data.replace(/^./, input.data[0].toUpperCase())
            newInput.required = input.required
            form.appendChild(newInput)
        })

        const button = document.createElement('button')
        button.classList.add('chat-send')
        button.type = 'submit'
        button.setAttribute('data-toggle', SELECTOR_VALUE_TOGGLE_SEND)
        button.innerHTML = '<strong>Send</strong>'
        form.appendChild(button)

        return form
    }

    _setEventListener() {
        this._toggleChat = document.querySelector(SELECTOR_DATA_TOGGLE_CHAT + '[data-target="#' + this._element.id + '"]')
        this._contentElement = this._element.getElementsByClassName(CLASS_NAME_WIDGET_CONTENT).item(0)
        this._toggleSend = this._element.querySelector(SELECTOR_DATA_TOGGLE_SEND)

        if (this._toggleChat) {
            this._toggleChat.addEventListener("click", (e) => {
                e.preventDefault()
                this.toggle()
            })
        }
        if (this._toggleSend) {
            this._toggleSend.addEventListener('click', (e) => {
                e.preventDefault()
                this._sendMessage()
            })
        }
    }

    _show() {
        this._element.classList.add(CLASS_NAME_WIDGET_EXPANDED)
        this._toggleChat.classList.add(CLASS_NAME_WIDGET_EXPANDED)
        this._contentElement.classList.add(CLASS_NAME_WIDGET_EXPANDED)
        this._isShown = true
    }

    _hide() {
        this._element.classList.remove(CLASS_NAME_WIDGET_EXPANDED)
        this._toggleChat.classList.remove(CLASS_NAME_WIDGET_EXPANDED)
        this._contentElement.classList.remove(CLASS_NAME_WIDGET_EXPANDED)
        this._isShown = false
    }

    _formValidation(formElement) {
        if (!formElement.required) return true

        formElement.classList.remove(CLASS_NAME_WIDGET_FORM_REQUIRED)

        switch (formElement.type) {
            case 'email':
                if (!/^\S+@\S+$/.test(formElement.value)) {
                    formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED)
                    return false
                }
                break
            default:
                if (formElement.value == '' || formElement.value == null) {
                    formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED)
                    return false
                }
                break
        }
        return true
    }

    _getConfig(config) {
        config = {
            ...DefaultConfig,
            ...config
        }
        this._typeCheck(config, DefaultConfigType)
        return config
    }

    _getInput(inputs) {
        if (typeof inputs === 'undefined' || inputs.length === 0)
            return DefaultForm
        
        return inputs
    }

    _verifyInput(inputs) {
        inputs.forEach(input => {
            this._typeCheck(input, DefaultFormType)
        })
    }

    _typeCheck(config, configTypes) {
        Object.keys(configTypes).forEach(property => {
            const expectedTypes = configTypes[property]
            const value = config[property]
            const valueType = value && this._isElement(value) ?
                'element' :
                this._toType(value)

            if (!new RegExp(expectedTypes).test(valueType)) {
                throw new Error(
                    `WhatsApp Widget: ` +
                    `Option "${property}" provided type "${valueType}" ` +
                    `but expected type "${expectedTypes}".`)
            }
        })
    }

    _isElement(obj) {
        (obj[0] || obj).nodeType
    }

    // AngusCroll (https://goo.gl/pxwQGp)
    _toType(obj) {
        if (obj === null || obj === undefined) {
            return `${obj}`
        }

        return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
    }
}

document.body.onload = () => {
    const chatSelector = document.querySelectorAll(SELECTOR_CHAT_WIDGET)
    for (let i = 0; i < chatSelector.length; i++) {
        const element = chatSelector[i]
        const data = new Chat(element, {}, []) // eslint-disable-line no-unused-vars
    }
}
