import json
import sys

GATE_TYPE, GATE_INPUTS, GATE_OUTPUTS = 0, 1, 2
IO_GATE_NO, IO_GATE_WIRENO = 0, 1
MAX_GATE_TYPE = 8
GT_INPUT = 0
GT_OUTPUT = 1
GT_NOT = 2
GT_AND = 3
GT_OR = 4
GT_XOR = 5
GT_NAND = 6
GT_NOR = 7
GT_XNOR = 8

def read_json(filename: str):
    jsonfile = None
    try:
        jsonfile = open(filename, 'r')
    except OSError:
        print(f"Error: failed to open file \"{filename}\"")
        exit()
    jsonobj = None
    try:
        jsonobj = json.load(jsonfile)
    except json.decoder.JSONDecodeError:
        print('Error: failed to decode the JSON file')
        exit()
    jsonfile.close()
    return jsonobj


def verify_scheme(gates) -> (list[int], list[int]):
    # gates: [gate0, gate1, ...]
    # gate: [type, inputs, outputs]
    # 0 <= type <= MAX_GATE_TYPE
    # inputs, outputs: [gateid0, gateid1, ...]
    # 0 <= gateid < len(gates)
    if type(gates) != list:
        print("Error: top-file object isn't an array")
        exit()
    module_inputs: list[int] = []
    module_outputs: list[int] = []
    for i in range(len(gates)):
        gate = gates[i]
        if type(gate) != list or len(gate) != 3:
            print(f"Error: incorrect gate no. {i}: {gate}")
            exit()
        if type(gate[GATE_TYPE]) != int or gate[GATE_TYPE] < 0 or gate[GATE_TYPE] > MAX_GATE_TYPE:
            print(f"Error: incorrect gate type in the gate no. {i}: {gate[GATE_TYPE]}")
            exit()
        if gate[GATE_TYPE] == GT_INPUT:
            module_inputs.append(i)
        elif gate[GATE_TYPE] == GT_OUTPUT:
            module_outputs.append(i)
        inputs = gate[GATE_INPUTS]
        outputs = gate[GATE_OUTPUTS]
        if type(inputs) != list:
            print(f"Error: incorrect inputs in the gate no. {i}: {inputs}")
            exit()
        elif type(outputs) != list:
            print(f"Error: incorrect outputs in the gate no. {i}: {outputs}")
            exit()
        for j in range(len(inputs)):
            if type(inputs[j]) != int or inputs[j] < 0 or inputs[j] >= len(gates):
                print(f"Error: incorrect gate id in the inputs of the gate no. {i}: inputs[{j}] = {inputs[j]}")
                exit()
            inputs[j] = [inputs[j], -1]
        for j in range(len(outputs)):
            if type(outputs[j]) != int or outputs[j] < 0 or outputs[j] >= len(gates):
                print(f"Error: incorrect gate id in the outputs of the gate no. {i}: outputs[{j}] = {outputs[j]}")
                exit()
            outputs[j] = [outputs[j], -1]
    return (module_inputs, module_outputs)


def generate_wire_no(gates: list) -> int:
    wire_cnt = 0
    for i in range(len(gates)):
        inputs, outputs = gates[i][GATE_INPUTS], gates[i][GATE_OUTPUTS]
        for j in range(len(inputs)):
            if inputs[j][IO_GATE_WIRENO] == -1: # wire isn't created yet
                inputs[j][IO_GATE_WIRENO] = wire_cnt
                in_gate = inputs[j][IO_GATE_NO]
                for out_gate in gates[in_gate][GATE_OUTPUTS]:
                    if out_gate[IO_GATE_NO] == i and out_gate[IO_GATE_WIRENO] == -1:
                        out_gate[IO_GATE_WIRENO] = wire_cnt
                        break
                else:
                    print(f"Error: in the gate no. {i} there's an input gate no. {j}, but the gate no. {j} hasn't the gate no. {i} in its outputs")
                    exit()
                wire_cnt += 1
        for j in range(len(outputs)):
            if outputs[j][IO_GATE_WIRENO] == -1: # wire isn't created yet
                outputs[j][IO_GATE_WIRENO] = wire_cnt
                out_gate = outputs[j][IO_GATE_NO]
                for in_gate in gates[out_gate][GATE_INPUTS]:
                    if in_gate[IO_GATE_NO] == i and in_gate[IO_GATE_WIRENO] == -1:
                        in_gate[IO_GATE_WIRENO] = wire_cnt
                        break
                else:
                    print(f"Error: in the gate no. {i} there's an output gate no. {j}, but the gate no. {j} hasn't the gate no. {i} in its inputs")
                    exit()
                wire_cnt += 1
    return wire_cnt

"""def generate_wires(gates: list) -> list[(int, int)]:
    wires = []
    for i in range(len(gates)):
        inputs, outputs = gates[i][GATE_INPUTS], gates[i][GATE_OUTPUTS]
        for j in range(len(inputs)):
            if inputs[j][IO_GATE_WIRENO] == -1: # wire isn't created yet
                wire_cnt = len(wires)
                inputs[j][IO_GATE_WIRENO] = wire_cnt
                in_gate = inputs[j][IO_GATE_NO]
                for out_gate in gates[in_gate][GATE_OUTPUTS]:
                    if out_gate[IO_GATE_NO] == i and out_gate[IO_GATE_WIRENO] == -1:
                        out_gate[IO_GATE_WIRENO] = wire_cnt
                        wires.append((in_gate, out_gate))
                        break
                else:
                    print(f"Error: in the gate no. {i} there's an input no. {j}, buyt the gate no. {j} hasn't the gate no. {i} in its outputs")
                    exit()
        for j in range(len(outputs)):
            if outputs[j][IO_GATE_WIRENO] == -1: # wire isn't created yet
                wire_cnt = len(wires)
                outputs[j][IO_GATE_WIRENO] = wire_cnt
                out_gate = outputs[j][IO_GATE_NO]
                for in_gate in gates[out_gate][GATE_INPUTS]:
                    if in_gate[IO_GATE_NO] == i and in_gate[IO_GATE_WIRENO] == -1:
                        in_gate[IO_GATE_WIRENO] = wire_cnt
                        wires.append((in_gate, out_gate))
                        break
                else:
                    print(f"Error: in the gate no. {i} there's an output gate no. {j}, but the gate no. {j} hasn't the gate no. {i} in its inputs")
                    exit()
    return wires"""


def write_verilog_scheme(gates: list, module_inputs: list[int], module_outputs: list[int], wire_cnt: int, out_file_name: str):
    out_file = None
    try:
        out_file = open(out_file_name, 'w')
    except OSError:
        print(f"Error: failed to open the file \"{out_file_name}\" for writing")
        exit()
    s_inputs = ', '.join(map(lambda x: 'i' + str(x), module_inputs))
    s_outputs = ', '.join(map(lambda x: 'o' + str(x), module_outputs))
    param_str = f"{s_inputs}{', ' if len(s_inputs) != 0 and len(s_outputs) != 0 else ''}{s_outputs}"
    out_file.write(f"module main({param_str});\n")
    out_file.write(f"input {s_inputs};\n")
    out_file.write(f"output {s_outputs};\n")
    wires_str = ', '.join(map(lambda x: 'w' + str(x), range(wire_cnt)))
    out_file.write(f"wire {wires_str};\n")
    """for i in range(len(gates)):
        gate = gates[i]
        gtp = gate[GATE_TYPE]
        out_file.write('assign ')
        if gtp == GT_INPUT:
            gate_out = gate[GATE_OUTPUTS][0][IO_GATE_WIRENO]
            out_file.write(f"w{gate_out} = i{i}")
        elif gtp == GT_OUTPUT:
            gate_in = gate[GATE_INPUTS][0][IO_GATE_WIRENO]
            out_file.write(f"o{i} = w{gate_in}")
        elif gtp == GT_NOT:
            gate_in = gate[GATE_INPUTS][0][IO_GATE_WIRENO]
            gate_out = gate[GATE_OUTPUTS][0][IO_GATE_WIRENO]
            out_file.write(f"w{gate_out} = !w{gate_in}")
        else:
            gate_in1, gate_in2 = gate[GATE_INPUTS][0][IO_GATE_WIRENO], gate[GATE_INPUTS][1][IO_GATE_WIRENO]
            gate_out = gate[GATE_OUTPUTS][0][IO_GATE_WIRENO]
            out_file.write(f"w{gate_out} = ")
            if gtp == GT_AND:
                out_file.write(f"w{gate_in1} & w{gate_in2}")
            elif gtp == GT_OR:
                out_file.write(f"w{gate_in1} | w{gate_in2}")
            elif gtp == GT_XOR:
                out_file.write(f"w{gate_in1} ^ w{gate_in2}")
            elif gtp == GT_NAND:
                out_file.write(f"!(w{gate_in1} & w{gate_in2})")
            elif gtp == GT_NOR:
                out_file.write(f"!(w{gate_in1} | w{gate_in2})")
            elif gtp == GT_XNOR:
                out_file.write(f"!(w{gate_in1} ^ w{gate_in2})")
            else:
                print(f"Error: incorrect gate type at the gate no. {i}: type = {gtp}")
                exit()
        out_file.write(";\n")"""
    for i in range(len(gates)):
        gate = gates[i]
        gtp = gate[GATE_TYPE]
        if gtp == GT_INPUT:
            for out_wire in gate[GATE_OUTPUTS]:
                wireno = out_wire[IO_GATE_WIRENO]
                out_file.write(f"assign w{wireno} = i{i};\n")
        elif gtp == GT_OUTPUT:
            wireno = gate[GATE_INPUTS][0][IO_GATE_WIRENO]
            out_file.write(f"assign o{i} = w{wireno};\n")
        elif gtp == GT_NOT:
            in_wire = gate[GATE_INPUTS][0][IO_GATE_WIRENO]
            for out_wire in gate[GATE_OUTPUTS]:
                wireno = out_wire[IO_GATE_WIRENO]
                out_file.write(f"assign w{wireno} = !w{in_wire};\n")
        else:
            in_wire1, in_wire2 = gate[GATE_INPUTS][0][IO_GATE_WIRENO], gate[GATE_INPUTS][1][IO_GATE_WIRENO]
            expr_str = ''
            if gtp == GT_AND:
                expr_str = f"w{in_wire1} & w{in_wire2}"
            elif gtp == GT_OR:
                expr_str = f"w{in_wire1} | w{in_wire2}"
            elif gtp == GT_XOR:
                expr_str = f"w{in_wire1} ^ w{in_wire2}"
            elif gtp == GT_NAND:
                expr_str = f"!(w{in_wire1} & w{in_wire2})"
            elif gtp == GT_NOR:
                expr_str = f"!(w{in_wire1} | w{in_wire2})"
            elif gtp == GT_XNOR:
                expr_str = f"!(w{in_wire1} ^ w{in_wire2})"
            else:
                print(f"Error: incorrect gate type in the gate no. {i}: type = {gtp}")
                exit()
            for out_wire in gate[GATE_OUTPUTS]:
                wireno = out_wire[IO_GATE_WIRENO]
                out_file.write(f"assign w{wireno} = {expr_str};\n")
    out_file.write("endmodule\n")
    out_file.close()


"""def write_verilog_scheme(gates: list, module_inputs: list[int], module_outputs: list[int], wires: list[(int, int)], out_filename: str):
    out_file = None
    try:
        out_file = open(out_filename, 'w')
    except OSError:
        print(f"Error: failed to open the file \"{out_filename}\" for writing")
        exit()
    s_inputs = ', '.join(map(lambda x: 'i' + str(x), module_inputs))
    s_outputs = ', '.join(map(lambda x: 'o' + str(x), module_outputs))
    param_str = f"{s_inputs}{', ' if len(s_inputs) != 0 and len(s_outputs) != 0 else ''}{s_outputs}"
    out_file.write(f"module main({param_str});\n")
    out_file.write(f"input {s_inputs};\n")
    out_file.write(f"output {s_outputs};\n")
    wires_str = ', '.join(map(lambda x: 'w' + str(x), range(len(wires))))
    out_file.write(f"wire {wires_str};\n")
    for pair in wires:
        in_gate, out_gate = pair[0], pair[1]"""



def verify_inputs(inputs, module_inputs: list[int]):
    if type(inputs) != list or len(inputs) != len(module_inputs):
        print("Error: top-level object isn't an array")
        exit()
    for i in range(len(inputs)):
        if type(inputs[i]) != int or inputs[i] < 0 or inputs[i] > 1:
            print(f"Error: incorrect input value: {inputs[i]}")
            exit()


def write_testbench(inputs: list[int], output_cnt: int, filename: str):
    try:
        out_file = open(filename + ".sv", "w")
    except OSError:
        print("Err")
        exit()
    out_file.write("module test;\n")
    ins = ", ".join(map(lambda x: "i" + str(x), range(len(inputs))))
    out_file.write(f"reg {ins};\n")
    outs = ", ".join(map(lambda x: "o" + str(x), range(output_cnt)))
    out_file.write(f"reg {outs};\n")
    out_file.write("initial begin\n")
    for i in range(len(inputs)):
        out_file.write(f"i{i} = {inputs[i]};\n")
    out_file.write("end\n")
    out_file.write(f"main dut({ins}, {outs});\n")
    out_file.write("integer h1;\n")
    out_file.write("initial\n")
    fmt_s = "%d " * output_cnt
    out_file.write(f"$monitor(h1, \"At time %t: [{fmt_s}]\", $time, {outs});\n")
    out_file.write("endmodule")
    out_file.close()


if len(sys.argv) != 3:
    print(f"usage: {sys.argv[0]} <scheme.json> <inputs.json>")
    exit()
scheme_filename = sys.argv[1]
gates = read_json(scheme_filename)
module_inputs, module_outputs = verify_scheme(gates)
wire_cnt = generate_wire_no(gates)
scheme_out_filename = scheme_filename[:scheme_filename.rindex('.')]
write_verilog_scheme(gates, module_inputs, module_outputs, wire_cnt, scheme_out_filename + '.sv')

testbench_filename = sys.argv[2]
inputs = read_json(testbench_filename)
# print("inputs =", inputs)
verify_inputs(inputs, module_inputs)
testbench_out_filename = testbench_filename[:testbench_filename.rindex('.')]
write_testbench(inputs, len(module_outputs), testbench_out_filename)