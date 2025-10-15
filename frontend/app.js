const API_BASE_URL = '/api';

class FamilyTreeApp {
    constructor() {
        this.persons = [];
        this.init();
    }

    async init() {
        console.log('Initializing Family Tree App...');
        this.setupEventListeners();
        await this.loadPersons();
        await this.loadTree();
    }

    setupEventListeners() {
        const form = document.getElementById('personForm');
        // Убираем стандартное поведение формы
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });
    }

    async apiCall(endpoint, options = {}) {
        try {
            console.log(`Making API call to: ${API_BASE_URL}${endpoint}`, options);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            if (options.body) {
                config.body = JSON.stringify(options.body);
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response data:', data);
            return data;

        } catch (error) {
            console.error('API call failed:', error);
            this.showError(`Ошибка соединения с сервером: ${error.message}`);
            throw error;
        }
    }

    async loadPersons() {
        try {
            console.log('Loading persons...');
            this.persons = await this.apiCall('/persons/');
            console.log('Loaded persons:', this.persons);
            this.updateParentSelect();
        } catch (error) {
            console.error('Failed to load persons:', error);
            this.showError('Не удалось загрузить список людей');
        }
    }

    async loadTree() {
        try {
            console.log('Loading tree...');
            const treeData = await this.apiCall('/tree/');
            console.log('Loaded tree:', treeData);
            this.renderTree(treeData);
        } catch (error) {
            console.error('Failed to load tree:', error);
            this.showTreeError();
        }
    }

    updateParentSelect() {
        const select = document.getElementById('parentId');
        select.innerHTML = '<option value="">-- Выберите родителя --</option>';

        this.persons.forEach(person => {
            const option = document.createElement('option');
            option.value = person.id;
            option.textContent = `${person.first_name} ${person.last_name} (ID: ${person.id})`;
            select.appendChild(option);
        });
    }

    renderTree(treeData) {
        const container = document.getElementById('treeContainer');

        if (!treeData || treeData.length === 0) {
            container.innerHTML = `
                <div class="empty-tree">
                    <h3>Дерево пока пустое 🌱</h3>
                    <p>Добавьте первого родственника чтобы начать строить дерево!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = treeData.map(person => this.renderTreeNode(person, 0)).join('');
    }

    renderTreeNode(person, level = 0) {
        const childrenHTML = person.children && person.children.length > 0
            ? `<div class="children-container">${person.children.map(child => this.renderTreeNode(child, level + 1)).join('')}</div>`
            : '';

        const birthDate = person.birth_date ?
            new Date(person.birth_date + 'T00:00:00').toLocaleDateString('ru-RU') : '';

        return `
            <div class="tree-node level-${level}">
                <div class="person-card">
                    <div class="person-name">${this.escapeHtml(person.first_name)} ${this.escapeHtml(person.last_name)}</div>
                    ${person.birth_date ? `<div class="person-birth">🎂 ${birthDate}</div>` : ''}
                    <div class="person-id">ID: ${person.id}</div>
                </div>
                ${childrenHTML}
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async handleSubmit(event) {
        console.log('Form submitted');

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Добавление...';

            // Получаем данные формы
            const formData = new FormData(event.target);
            const parentId = formData.get('parent_id');

            const personData = {
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                birth_date: formData.get('birth_date') || null,
                parent_id: parentId ? parseInt(parentId) : null
            };

            console.log('Submitting person data:', personData);

            // Отправляем POST запрос к API
            await this.apiCall('/persons/', {
                method: 'POST',
                body: personData
            });

            this.showSuccess('Родственник успешно добавлен!');

            // Очищаем форму
            event.target.reset();

            // Обновляем данные
            await this.loadPersons();
            await this.loadTree();

        } catch (error) {
            console.error('Failed to create person:', error);
            this.showError('Ошибка при добавлении родственника. Проверьте консоль для подробностей.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        const messageContainer = document.getElementById('messageContainer');
        messageContainer.innerHTML = '';

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        messageContainer.appendChild(messageDiv);

        // Автоматически удаляем через 5 секунд
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    showTreeError() {
        const container = document.getElementById('treeContainer');
        container.innerHTML = `
            <div class="error">
                Не удалось загрузить дерево. Проверьте:<br>
                1. Запущен ли бэкенд на порту 8000<br>
                2. Открыт ли порт 8000 в firewall<br>
                3. Логи бэкенда на наличие ошибок
            </div>
        `;
    }
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    window.familyTreeApp = new FamilyTreeApp();
});