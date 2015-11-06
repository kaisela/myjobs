/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
    config.toolbar = 'Full';

    config.toolbar_Full =
    [
        ['Source', 'Bold', 'Italic', 'Underline', 'NumberedList', 'BulletedList', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'Link', 'Unlink', "Image", 'Table', 'customerupload', 'Maximize'],
        ['Styles', 'Format', 'Font', 'FontSize', 'TextColor', 'BGColor']
    ];
    config.filebrowserImageUploadUrl = "/CKEditorImage/ImageUpLoad";
    config.extraPlugins = "customerupload";
};
//CKEDITOR.on('dialogDefinition', function (ev) {
//    var dialogName = ev.data.name,
//    dialogDefinition = ev.data.definition;
//    debugger;
//    if (dialogName === 'image') {
//        dialogDefinition.removeContents('advanced');
//        dialogDefinition.removeContents('Link');
//        dialogDefinition.removeContents('Upload');
//    }
//});
CKEDITOR.on('instanceReady', function (ev) {
    $(".cke_button__image").hide();
});