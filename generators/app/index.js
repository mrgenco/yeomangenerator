var Generator = require('yeoman-generator');
module.exports = class extends Generator {

    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
        // Entity fields
        this.fields = [];
        this.option('babel'); // This method adds support for a `--babel` flag
    }

    async prompting() {
        this.log("*** Welcome to MRG CRUD Generator ***");
        this.answers = await this.prompt([
            {
                type: 'list',
                choices: ["COMMERCIAL", "COMMERCIAL_I18N", "OWNER", "COMMERCIAL_LOGS"],
                name: 'schemaName',
                message: 'Select the database schema where your table is located.',
                default: "COMMERCIAL"
            },
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

        var field = await this.prompt([
            {
                type: 'confirm',
                name: 'fieldAdd',
                message: 'Do you want to add a field to your entity?',
                default: true
            },
            {
                when: response => response.fieldAdd === true,
                type: 'list',
                choices: ["String", "Number", "Boolean"],
                name: 'fieldType',
                message: 'What is the type of your field?',
                default: "String"
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
        if (field.fieldAdd) {
            this.fields.push(field);
            this.log("new field added -->" + JSON.stringify(this.fields));
            await this._getFields();
        } else {
            return;
        }

    }

    writing() {

        this.fs.copyTpl(
            this.templatePath('admin/CRUDPageTemplate.vue.ejs'),
            this.destinationPath('public/' + this.answers.entityName + '.vue'),
            {
                pageTitle: this.answers.pageTitle,
                entityName: this.answers.entityName,
                fields: this.fields
            }
        );
       // this.log(this.answers.pageTitle+" is generated successfully..");

            
        this.fs.copyTpl(
            this.templatePath('admin/ControllerTemplate.java.ejs'),
            this.destinationPath('public/' + this.answers.entityName + 'Controller.java'),
            {
                entityName: this.answers.entityName,
                schemaName: this.answers.schemaName
            }
        );
        //this.log(this.answers.entityName+"Controller is generated successfully..");

        this.fs.copyTpl(
            this.templatePath('admin/RepositoryTemplate.java.ejs'),
            this.destinationPath('public/' + this.answers.entityName + 'Repository.java'),
            {
                entityName: this.answers.entityName,
                schemaName: this.answers.schemaName
            }
        );
        //this.log(this.answers.entityName+"Repository is generated successfully..");


        this.fs.copyTpl(
            this.templatePath('admin/ServiceTemplate.java.ejs'),
            this.destinationPath('public/' + this.answers.entityName + 'Service.java'),
            {
                entityName: this.answers.entityName,
                schemaName: this.answers.schemaName
            }
        );
        //this.log(this.answers.entityName+"Service is generated successfully..");


        this.fs.copyTpl(
            this.templatePath('admin/ServiceImplTemplate.java.ejs'),
            this.destinationPath('public/' + this.answers.entityName + 'ServiceImpl.java'),
            {
                entityName: this.answers.entityName,
                schemaName: this.answers.schemaName
            }
        );
       // this.log(this.answers.entityName+"ServiceImpl is generated successfully..");


    }

};