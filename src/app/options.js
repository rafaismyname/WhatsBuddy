import selector from './utils/selector';
import storage from './utils/storage';

import '../styles/options.scss';

class Options {
  constructor() {
    /**
     * Predefined values.
     *
     * @type Object
     */
    this.defaults = {
      messageSuccess: 'Options saved successfully!',
      messageError: 'Please fill all items in the form.',
      messageTime: 2000,
    };

    selector(document).ready(this.bind());
  }

  bind() {
    /**
    * Detect click action under save button.
    */
    selector('.save-options').click(() => {
      // Get filled
      const options = Options.getOptions();

      // Check if exists some field filled.
      if (!options.standard) {
        // Set error message.
        this.response(this.defaults.messageError, 'error');
        return;
      }

      // Store values to the Chrome storage.
      storage.save(options).then(() => {
        this.response(this.defaults.messageSuccess, 'success');
      });
    });

    // Set default options or saved options already.
    Options.setOptions();
  }

  /**
   * Get values from the form
   *
   * @param {Callback} callback
   */
  static getOptions() {
    return {
      standard: selector('#default-input').val(),
      checkbox: selector('#default-checkbox').checked(),
    };
  }

  /**
   * Retrieve values from Chrome storage and set as default value.
   */
  static setOptions() {
    storage.get({
      standard: '',
      checkbox: false,
    }).then((data) => {
      // Set degault values or saved options.
      selector('#default-input').val(data.standard);
      selector('#default-checkbox').checked(data.checkbox);
    });
  }

  /**
   * Set message to the options container.
   *
   * @param {String} message
   * @param {String} classname
   */
  response(message, classname) {
    // Set text message.
    selector('.response').text(message);
    // Add provided class.
    selector('.response').addClass(classname);

    // Remove class after defined time.
    setTimeout(() => {
      selector('.response').removeClass(classname);
    }, this.defaults.messageTime);
  }
}

export default new Options();
