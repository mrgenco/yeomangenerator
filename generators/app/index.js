var Generator = require('yeoman-generator');
var fields = [];
module.exports = class extends Generator {

    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        this.fields = [];

        // Next, add your custom code
        this.option('babel'); // This method adds support for a `--babel` flag
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'pageTitle',
                message: 'Enter a page title (Ex : Country Page)'
            },
            {
                type: 'input',
                name: 'entityName',
                message: 'Enter an entity name (Ex : Country)'
            }]);

        await this._getFields();
        
    }

    async _getFields() {

        var fields =  await this.prompt([
            {
                type: 'confirm',
                name: 'fieldAdd',
                message: 'Do you want to add a field to your entity?',
                default: true
            },
            {
                when: response => response.fieldAdd === true,
                type: 'input',
                name: 'fieldName',
                validate: input => {
                    if (!/^([a-zA-Z0-9_]*)$/.test(input)) {
                        return 'Your field name cannot contain special characters';
                    }
                    if (input === '') {
                        return 'Your field name cannot be empty';
                    }
                    if (input.charAt(0) === input.charAt(0).toUpperCase()) {
                        return 'Your field name cannot start with an upper case letter';
                    }
                    return true;
                },
                message: 'What is the name of your field?'
            }


        ]);

        if (fields.fieldAdd) {
            this.fields.push(fields.fieldName);            
            this.log("fields :" + JSON.stringify(this.fields));
            await this._getFields();
        } else{ 
            return;
        }

    }

    writing() {
        
        this.log("fields writing :" + JSON.stringify(this.fields));
        this.fs.copyTpl(
            this.templatePath('admin/CRUDTemplate.vue.ejs'),
            this.destinationPath('public/' + this.answers.entityName + '.vue'),
            { pageTitle: this.answers.pageTitle, entityName: this.answers.entityName } // user answer `title` used
        );
    }

};