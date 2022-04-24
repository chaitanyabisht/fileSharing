import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;

void main() => runApp(MaterialApp(
  home: MyApp(),
));

class MyApp extends StatelessWidget {


  List<PlatformFile>? _files;

  void _uploadFile() async {
    //TODO replace the url bellow with you ipv4 address in ipconfig
    var uri = Uri.parse('https://file.cse-iitbh.in/uploadfile');
    Map<String, String> header = {"origin": "https://file.cse-iitbh.in/files"};
    var request = http.MultipartRequest('POST', uri);
    request.headers.addAll(header);
    request.files.add(await http.MultipartFile.fromPath('file', _files!.first.path.toString()));
    request.fields["email"] = "vsatvik2003@gmail.com";
    request.fields["time"] = "2";
    var response = await request.send();
    if(response.statusCode == 200) {
      print('Uploaded ...');
      print(response);
    } else {
      print("response.toString()");
    }

  }

  void _openFileExplorer() async {
    _files = (await FilePicker.platform.pickFiles(
        type: FileType.any,
        allowMultiple: false,
        allowedExtensions: null
    ))!.files;

    print('Loaded file path is : ${_files!.first.path}');
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text('File Upload'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(onPressed: _openFileExplorer, child: Text('Open File Explorer')),
            ElevatedButton(onPressed: _uploadFile, child: Text('Upload File'))
          ],
        ),
      ),
    );
  }
}